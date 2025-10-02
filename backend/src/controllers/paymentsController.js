const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { User } = require('../models');

// Crear sesión de checkout para plan premium
const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Verificar si ya es premium
    if (user.is_premium) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya tiene plan premium',
      });
    }

    // Crear o obtener customer de Stripe
    let customerId = user.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          user_id: userId.toString(),
        },
      });
      
      customerId = customer.id;
      
      // Actualizar usuario con customer ID
      await user.update({ stripe_customer_id: customerId });
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'EdooConnect Premium',
              description: 'Análisis financiero completo con recomendaciones personalizadas y reportes avanzados',
              images: ['https://via.placeholder.com/300x200?text=EdooConnect+Premium'],
            },
            unit_amount: 2500, // $25.00 en centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: {
        user_id: userId.toString(),
        plan: 'premium',
      },
    });

    res.json({
      success: true,
      data: {
        checkout_url: session.url,
        session_id: session.id,
      },
    });
  } catch (error) {
    console.error('Error creando sesión de checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Verificar estado del pago
const verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.params;
    const userId = req.user.id;

    // Obtener sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.metadata.user_id !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver esta sesión',
      });
    }

    // Verificar si el pago fue exitoso
    if (session.payment_status === 'paid') {
      // Actualizar usuario a premium
      const user = await User.findByPk(userId);
      if (user && !user.is_premium) {
        await user.update({ is_premium: true });
      }

      res.json({
        success: true,
        data: {
          payment_status: session.payment_status,
          is_premium: true,
        },
      });
    } else {
      res.json({
        success: true,
        data: {
          payment_status: session.payment_status,
          is_premium: false,
        },
      });
    }
  } catch (error) {
    console.error('Error verificando pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Webhook para manejar eventos de Stripe
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Error verificando webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar el evento
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      if (session.metadata.plan === 'premium') {
        const userId = parseInt(session.metadata.user_id);
        
        try {
          const user = await User.findByPk(userId);
          if (user && !user.is_premium) {
            await user.update({ is_premium: true });
            console.log(`✅ Usuario ${userId} actualizado a premium`);
          }
        } catch (error) {
          console.error('Error actualizando usuario a premium:', error);
        }
      }
      break;

    case 'payment_intent.payment_failed':
      console.log('❌ Pago fallido:', event.data.object);
      break;

    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  res.json({ received: true });
};

// Obtener información del plan del usuario
const getUserPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.json({
      success: true,
      data: {
        is_premium: user.is_premium,
        plan: user.is_premium ? 'premium' : 'free',
        stripe_customer_id: user.stripe_customer_id,
      },
    });
  } catch (error) {
    console.error('Error obteniendo plan del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

module.exports = {
  createCheckoutSession,
  verifyPayment,
  handleWebhook,
  getUserPlan,
};
