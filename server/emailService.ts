import nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
const dotenv = import.meta.env || process.env;
dotenvConfig();

// Create transporter
export const createTransporter = () => {
  const hasRealSMTP = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  
  if (process.env.NODE_ENV === 'development' && !hasRealSMTP) {
    // Use Ethereal.email for testing in development
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER || 'your-ethereal-user',
        pass: process.env.ETHEREAL_PASS || 'your-ethereal-pass'
      }
    });
  }
  
  // Use real SMTP for production or when configured
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Professional Email Templates
export const emailTemplates = {
  // CUSTOMER: Order Confirmation (sent when order is placed)
  customerOrderConfirmation: (order: any, user: any) => {
    const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    
    const itemsRows = Array.isArray(order.items) && order.items.length > 0
      ? order.items.map((item: any) => {
          const p = item.product || item.productId || {};
          const productName = p.name || item.name || 'Product';
          const unitPrice = item.unitPrice || p.price || 0;
          const quantity = item.quantity || 1;
          const lineTotal = unitPrice * quantity;
          return `
            <tr>
              <td style="padding: 14px 12px; border: 1px solid #e0e0e0; color: #333;">${productName}</td>
              <td style="text-align: center; padding: 14px 12px; border: 1px solid #e0e0e0; color: #666;">${quantity}</td>
              <td style="text-align: right; padding: 14px 12px; border: 1px solid #e0e0e0; color: #333; font-weight: 600;">₹${lineTotal.toLocaleString()}</td>
            </tr>
          `;
        }).join('')
      : '<tr><td colspan="3" style="padding: 14px 12px; border: 1px solid #e0e0e0; text-align:center; color: #999;">No items</td></tr>';
    
    const shipping = order.shippingAddress || {};
    const tracking = order.trackingNumber || `TRK-${String(order._id || '').slice(-8).toUpperCase()}`;
    
    return {
      subject: `✨ Order Confirmed! #${String(order._id || '').slice(-6)} | Soft Berry Skincare`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">🎉 Thank You for Your Order!</h1>
                      <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">We've received your order and are getting it ready</p>
                    </td>
                  </tr>
                  
                  <!-- Greeting -->
                  <tr>
                    <td style="padding: 35px 30px 25px 30px;">
                      <h2 style="margin: 0 0 12px 0; color: #2d3748; font-size: 24px; font-weight: 600;">Hi ${user.firstName || 'Valued Customer'}! 👋</h2>
                      <p style="margin: 0; color: #4a5568; font-size: 16px; line-height: 1.6;">Thank you for shopping with Soft Berry Skincare! We're excited to let you know that we've received your order and our team is already working on it.</p>
                    </td>
                  </tr>
                  
                  <!-- Order Summary -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f7fafc; border-radius: 8px; border: 2px solid #e2e8f0;">
                        <tr>
                          <td style="padding: 25px;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="padding-bottom: 12px; color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Order Number</td>
                                <td align="right" style="padding-bottom: 12px; color: #2d3748; font-size: 16px; font-weight: 700;">#${String(order._id || '').slice(-8)}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 12px; color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Order Date</td>
                                <td align="right" style="padding-bottom: 12px; color: #2d3748; font-size: 15px; font-weight: 600;">${orderDate}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 12px; color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Total Amount</td>
                                <td align="right" style="padding-bottom: 12px; color: #38a169; font-size: 24px; font-weight: 800;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 12px; color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Payment Method</td>
                                <td align="right" style="padding-bottom: 12px; color: #2d3748; font-size: 15px; font-weight: 600;">${order.paymentMethod || 'Online'}</td>
                              </tr>
                              <tr>
                                <td style="color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Current Status</td>
                                <td align="right"><span style="display: inline-block; padding: 6px 14px; background-color: #fef5e7; color: #c05621; font-size: 13px; font-weight: 700; border-radius: 20px; text-transform: capitalize;">${order.status || 'Processing'}</span></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Items Table -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <h3 style="margin: 0 0 16px 0; color: #2d3748; font-size: 18px; font-weight: 600;">📦 Your Items (${order.items?.length || 0})</h3>
                      <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                        <thead>
                          <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <th style="text-align: left; padding: 14px 12px; color: #ffffff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                            <th style="text-align: center; padding: 14px 12px; color: #ffffff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                            <th style="text-align: right; padding: 14px 12px; color: #ffffff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                          </tr>
                        </thead>
                        <tbody>${itemsRows}</tbody>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Shipping Address -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f0fff4; border-radius: 8px; border: 2px solid #c6f6d5;">
                        <tr>
                          <td style="padding: 20px;">
                            <h4 style="margin: 0 0 12px 0; color: #276749; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">🚚 Where We're Shipping</h4>
                            <p style="margin: 0; color: #2f855a; font-size: 15px; line-height: 1.6; font-weight: 500;">
                              <strong style="color: #22543d;">${shipping.firstName || ''} ${shipping.lastName || ''}</strong><br>
                              ${shipping.address || ''}<br>
                              ${shipping.city || ''}, ${shipping.state || ''} ${shipping.zipCode || shipping.postalCode || ''}<br>
                              ${shipping.country || ''}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Tracking CTA -->
                  <tr>
                    <td style="padding: 0 30px 35px 30px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ebf8ff; border-radius: 8px; border: 2px solid #bee3f8;">
                        <tr>
                          <td style="padding: 22px; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #2c5282; font-size: 17px; font-weight: 600;">📍 Track Your Order Anytime</h4>
                            <p style="margin: 0 0 16px 0; color: #2b6cb0; font-size: 14px; line-height: 1.6;">Stay updated! Click below to check your order status:</p>
                            <a href="https://softberryskincare.com/track-order?order=${order._id || ''}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 25px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">Track Order Now →</a>
                            <p style="margin: 12px 0 0 0; color: #718096; font-size: 13px;">Tracking ID: <span style="color: #2d3748; font-weight: 600;">${tracking}</span></p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 3px solid #e2e8f0;">
                      <p style="margin: 0 0 12px 0; color: #4a5568; font-size: 15px; line-height: 1.6;">Questions? We're here to help 24/7!</p>
                      <p style="margin: 0 0 20px 0; color: #718096; font-size: 14px;">Email us at <a href="mailto:softberryskincare@gmail.com" style="color: #667eea; text-decoration: none; font-weight: 600;">softberryskincare@gmail.com</a></p>
                      <p style="margin: 0; color: #a0aec0; font-size: 13px;">© 2024 Soft Berry Skincare. Made with 💜</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };
  },

  // ADMIN: New Order Notification (sent when customer places order)
  adminNewOrderNotification: (order: any, user: any) => {
    const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    
    const itemsRows = Array.isArray(order.items) && order.items.length > 0
      ? order.items.map((item: any) => {
          const p = item.product || item.productId || {};
          const productName = p.name || item.name || 'Product';
          const unitPrice = item.unitPrice || p.price || 0;
          const quantity = item.quantity || 1;
          const lineTotal = unitPrice * quantity;
          return `
            <tr>
              <td style="padding: 14px 12px; border: 1px solid #e0e0e0; color: #333;">${productName}</td>
              <td style="text-align: center; padding: 14px 12px; border: 1px solid #e0e0e0; color: #666;">${quantity}</td>
              <td style="text-align: right; padding: 14px 12px; border: 1px solid #e0e0e0; color: #333; font-weight: 600;">₹${lineTotal.toLocaleString()}</td>
            </tr>
          `;
        }).join('')
      : '<tr><td colspan="3" style="padding: 14px 12px; border: 1px solid #e0e0e0; text-align:center; color: #999;">No items</td></tr>';
    
    const shipping = order.shippingAddress || {};
    const tracking = order.trackingNumber || `TRK-${String(order._id || '').slice(-8).toUpperCase()}`;
    
    return {
      subject: `🔔 NEW ORDER ALERT! #${String(order._id || '').slice(-6)} | Action Required`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
                  <!-- Alert Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 35px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800;">🚨 NEW ORDER RECEIVED!</h1>
                      <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px; font-weight: 600;">Immediate Action Required</p>
                    </td>
                  </tr>
                  
                  <!-- Quick Summary -->
                  <tr>
                    <td style="padding: 30px 30px 20px 30px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff5f5; border-radius: 8px; border: 2px solid #feb2b2;">
                        <tr>
                          <td style="padding: 20px;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="padding-bottom: 10px; color: #742a2a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">ORDER NUMBER</td>
                                <td align="right" style="padding-bottom: 10px; color: #c53030; font-size: 18px; font-weight: 800;">#${String(order._id || '').slice(-8)}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 10px; color: #742a2a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">CUSTOMER</td>
                                <td align="right" style="padding-bottom: 10px; color: #2d3748; font-size: 15px; font-weight: 600;">${user.firstName || 'Unknown'} ${user.lastName || ''}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 10px; color: #742a2a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">TOTAL AMOUNT</td>
                                <td align="right" style="padding-bottom: 10px; color: #c53030; font-size: 24px; font-weight: 800;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 10px; color: #742a2a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">PAYMENT METHOD</td>
                                <td align="right" style="padding-bottom: 10px; color: #2d3748; font-size: 15px; font-weight: 600;">${order.paymentMethod || 'Online'}</td>
                              </tr>
                              <tr>
                                <td style="color: #742a2a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">ORDER DATE</td>
                                <td align="right"><span style="color: #2d3748; font-size: 14px; font-weight: 600;">${orderDate}</span></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Items Table -->
                  <tr>
                    <td style="padding: 0 30px 25px 30px;">
                      <h3 style="margin: 0 0 14px 0; color: #2d3748; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">📦 Order Items (${order.items?.length || 0})</h3>
                      <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                        <thead>
                          <tr style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                            <th style="text-align: left; padding: 14px 12px; color: #ffffff; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                            <th style="text-align: center; padding: 14px 12px; color: #ffffff; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                            <th style="text-align: right; padding: 14px 12px; color: #ffffff; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                          </tr>
                        </thead>
                        <tbody>${itemsRows}</tbody>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Shipping Address -->
                  <tr>
                    <td style="padding: 0 30px 25px 30px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f0fff4; border-radius: 8px; border: 2px solid #9ae6b4;">
                        <tr>
                          <td style="padding: 20px;">
                            <h4 style="margin: 0 0 12px 0; color: #22543d; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">📍 SHIPPING ADDRESS</h4>
                            <p style="margin: 0; color: #276749; font-size: 14px; line-height: 1.6; font-weight: 500;">
                              <strong style="color: #22543d;">${shipping.firstName || ''} ${shipping.lastName || ''}</strong><br>
                              ${shipping.address || ''}<br>
                              ${shipping.city || ''}, ${shipping.state || ''} ${shipping.zipCode || shipping.postalCode || ''}<br>
                              ${shipping.country || ''}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Action Button -->
                  <tr>
                    <td style="padding: 0 30px 35px 30px; text-align: center;">
                      <table role="presentation" style="width: 100%; background-color: #ebf8ff; border-radius: 8px; border: 2px solid #bee3f8;">
                        <tr>
                          <td style="padding: 25px; text-align: center;">
                            <h4 style="margin: 0 0 12px 0; color: #2c5282; font-size: 17px; font-weight: 700; text-transform: uppercase;">⚡ PROCESS THIS ORDER NOW</h4>
                            <p style="margin: 0 0 18px 0; color: #2b6cb0; font-size: 14px; line-height: 1.6;">Review and begin processing immediately</p>
                            <a href="https://softberryskincare.com/admin/orders" style="display: inline-block; padding: 16px 36px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 8px rgba(245, 87, 108, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">Open Admin Panel →</a>
                            <p style="margin: 14px 0 0 0; color: #718096; font-size: 13px;">Tracking ID: <span style="color: #2d3748; font-weight: 600;">${tracking}</span></p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f7fafc; padding: 25px 30px; text-align: center; border-top: 3px solid #e2e8f0;">
                      <p style="margin: 0; color: #4a5568; font-size: 13px; line-height: 1.6;">Soft Berry Skincare Admin Notification System</p>
                      <p style="margin: 8px 0 0 0; color: #a0aec0; font-size: 12px;">© 2024 Soft Berry Skincare. Internal use only.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };
  },

  // CUSTOMER: Status Update (sent when admin updates order status)
  customerStatusUpdate: (order: any, user: any) => {
    const updateDate = new Date(order.updatedAt || order.createdAt || Date.now()).toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    
    const status = String(order.status || '').toLowerCase();
    let statusData = {
      emoji: '📦',
      title: 'Order Status Updated',
      message: 'Your order status has been updated',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    
    if (status === 'processing') {
      statusData = { emoji: '⚙️', title: 'Order Confirmed & Processing', message: 'We\'re preparing your order', color: '#38a169', gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' };
    } else if (status === 'shipped') {
      statusData = { emoji: '🚚', title: 'Your Order is On Its Way!', message: 'Great news - your order has shipped', color: '#3182ce', gradient: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)' };
    } else if (status === 'delivered') {
      statusData = { emoji: '✅', title: 'Order Delivered Successfully!', message: 'Your order has been delivered', color: '#38a169', gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' };
    } else if (status === 'cancelled' || status === 'canceled') {
      statusData = { emoji: '❌', title: 'Order Cancelled', message: 'Your order has been cancelled', color: '#e53e3e', gradient: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)' };
    }

    return {
      subject: `${statusData.emoji} ${statusData.title} | Order #${String(order._id || '').slice(-6)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
                  <!-- Status Header -->
                  <tr>
                    <td style="background: ${statusData.gradient}; padding: 40px 30px; text-align: center;">
                      <div style="font-size: 56px; margin-bottom: 10px;">${statusData.emoji}</div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">${statusData.title}</h1>
                      <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Order #${String(order._id || '').slice(-8)}</p>
                    </td>
                  </tr>
                  
                  <!-- Message -->
                  <tr>
                    <td style="padding: 35px 30px 25px 30px;">
                      <h2 style="margin: 0 0 12px 0; color: #2d3748; font-size: 22px; font-weight: 600;">Hi ${user.firstName || 'Valued Customer'}!</h2>
                      <p style="margin: 0; color: #4a5568; font-size: 16px; line-height: 1.6;">${statusData.message}. Here's the latest information about your order:</p>
                    </td>
                  </tr>
                  
                  <!-- Status Box -->
                  <tr>
                    <td style="padding: 0 30px 25px 30px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f7fafc; border-radius: 8px; border: 2px solid #e2e8f0;">
                        <tr>
                          <td style="padding: 25px;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="padding-bottom: 12px; color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">CURRENT STATUS</td>
                                <td align="right"><span style="display: inline-block; padding: 6px 16px; background-color: ${statusData.color}20; color: ${statusData.color}; font-size: 14px; font-weight: 700; border-radius: 20px; text-transform: capitalize;">${order.status || 'Unknown'}</span></td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 12px; color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">UPDATED ON</td>
                                <td align="right" style="padding-bottom: 12px; color: #2d3748; font-size: 15px; font-weight: 600;">${updateDate}</td>
                              </tr>
                              ${order.trackingNumber ? `<tr>
                                <td style="padding-bottom: 12px; color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">TRACKING NUMBER</td>
                                <td align="right" style="padding-bottom: 12px; color: #2d3748; font-size: 15px; font-weight: 600;">${order.trackingNumber}</td>
                              </tr>` : ''}
                              <tr>
                                <td style="color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">ORDER TOTAL</td>
                                <td align="right" style="color: #38a169; font-size: 20px; font-weight: 700;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Track CTA -->
                  <tr>
                    <td style="padding: 0 30px 35px 30px; text-align: center;">
                      <table role="presentation" style="width: 100%; background-color: #ebf8ff; border-radius: 8px; border: 2px solid #bee3f8;">
                        <tr>
                          <td style="padding: 25px; text-align: center;">
                            <h4 style="margin: 0 0 12px 0; color: #2c5282; font-size: 16px; font-weight: 600; text-transform: uppercase;">📍 View Complete Details</h4>
                            <p style="margin: 0 0 18px 0; color: #2b6cb0; font-size: 14px; line-height: 1.6;">Click below to see full order information</p>
                            <a href="https://softberryskincare.com/track-order?order=${order._id}" style="display: inline-block; padding: 14px 32px; background: ${statusData.gradient}; color: #ffffff; text-decoration: none; border-radius: 25px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">Track Your Order →</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 3px solid #e2e8f0;">
                      <p style="margin: 0 0 12px 0; color: #4a5568; font-size: 15px; line-height: 1.6;">Any questions? We're always here to help!</p>
                      <p style="margin: 0 0 20px 0; color: #718096; font-size: 14px;">Contact: <a href="mailto:softberryskincare@gmail.com" style="color: #667eea; text-decoration: none; font-weight: 600;">softberryskincare@gmail.com</a></p>
                      <p style="margin: 0; color: #a0aec0; font-size: 13px;">© 2024 Soft Berry Skincare 💜</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };
  },

  // ADMIN: Status Update Summary (notification that admin updated a status)
  adminStatusUpdateSummary: (order: any, user: any) => {
    const updateDate = new Date(order.updatedAt || order.createdAt || Date.now()).toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    
    const status = String(order.status || '').toLowerCase();
    let statusColor = '#667eea';
    let statusEmoji = '📦';
    
    if (status === 'processing') { statusColor = '#38a169'; statusEmoji = '⚙️'; }
    else if (status === 'shipped') { statusColor = '#3182ce'; statusEmoji = '🚚'; }
    else if (status === 'delivered') { statusColor = '#38a169'; statusEmoji = '✅'; }
    else if (status === 'cancelled' || status === 'canceled') { statusColor = '#e53e3e'; statusEmoji = '❌'; }

    return {
      subject: `${statusEmoji} STATUS UPDATED | Order #${String(order._id || '').slice(-6)} → ${order.status}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}aa 100%); padding: 35px 30px; text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 10px;">${statusEmoji}</div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800;">STATUS UPDATED</h1>
                      <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.95); font-size: 15px; font-weight: 600;">Order #${String(order._id || '').slice(-8)}</p>
                    </td>
                  </tr>
                  
                  <!-- Info Box -->
                  <tr>
                    <td style="padding: 30px 30px 20px 30px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff5f5; border-radius: 8px; border: 2px solid #feb2b2;">
                        <tr>
                          <td style="padding: 20px;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="padding-bottom: 10px; color: #742a2a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">CUSTOMER</td>
                                <td align="right" style="padding-bottom: 10px; color: #2d3748; font-size: 15px; font-weight: 600;">${user.firstName || 'Unknown'} ${user.lastName || ''}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 10px; color: #742a2a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">NEW STATUS</td>
                                <td align="right"><span style="display: inline-block; padding: 4px 12px; background-color: ${statusColor}20; color: ${statusColor}; font-size: 13px; font-weight: 700; border-radius: 15px; text-transform: capitalize;">${order.status || 'Unknown'}</span></td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 10px; color: #742a2a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">TOTAL AMOUNT</td>
                                <td align="right" style="padding-bottom: 10px; color: #c53030; font-size: 20px; font-weight: 700;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                              </tr>
                              <tr>
                                <td style="color: #742a2a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">UPDATED AT</td>
                                <td align="right"><span style="color: #2d3748; font-size: 14px; font-weight: 600;">${updateDate}</span></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Action -->
                  <tr>
                    <td style="padding: 0 30px 35px 30px; text-align: center;">
                      <table role="presentation" style="width: 100%; background-color: #ebf8ff; border-radius: 8px; border: 2px solid #bee3f8;">
                        <tr>
                          <td style="padding: 25px; text-align: center;">
                            <h4 style="margin: 0 0 12px 0; color: #2c5282; font-size: 16px; font-weight: 600; text-transform: uppercase;">📋 VIEW IN ADMIN PANEL</h4>
                            <p style="margin: 0 0 18px 0; color: #2b6cb0; font-size: 14px; line-height: 1.6;">Review complete order details</p>
                            <a href="https://softberryskincare.com/admin/orders" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 25px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3); text-transform: uppercase; letter-spacing: 0.5px;">Open Admin Panel →</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f7fafc; padding: 25px 30px; text-align: center; border-top: 3px solid #e2e8f0;">
                      <p style="margin: 0; color: #4a5568; font-size: 13px; line-height: 1.6;">Admin System Notification</p>
                      <p style="margin: 8px 0 0 0; color: #a0aec0; font-size: 12px;">© 2024 Soft Berry Skincare</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };
  }
};

// Send email function
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'softberryskincare@gmail.com',
      to,
      subject,
      html
    };
    
    console.log(`📧 Sending email to: ${to}`);
    console.log(`📧 Subject: ${subject}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Preview: https://ethereal.email/message/' + info.messageId);
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error };
  }
};

// CUSTOMER FACING EMAILS
export const sendCustomerOrderConfirmation = async (order: any, user: any) => {
  try {
    console.log('📧 Sending ORDER CONFIRMATION to customer:', user.email);
    if (!user?.email) throw new Error('Customer email required');
    
    const template = emailTemplates.customerOrderConfirmation(order, user);
    const result = await sendEmail(user.email, template.subject, template.html);
    
    console.log(result.success ? '✅ Customer confirmation sent' : '❌ Failed');
    return result;
  } catch (error) {
    console.error('❌ sendCustomerOrderConfirmation error:', error);
    return { success: false, error };
  }
};

export const sendCustomerStatusUpdate = async (order: any, user: any) => {
  try {
    console.log('📧 Sending STATUS UPDATE to customer:', user.email);
    if (!user?.email) throw new Error('Customer email required');
    
    const template = emailTemplates.customerStatusUpdate(order, user);
    const result = await sendEmail(user.email, template.subject, template.html);
    
    console.log(result.success ? '✅ Customer status update sent' : '❌ Failed');
    return result;
  } catch (error) {
    console.error('❌ sendCustomerStatusUpdate error:', error);
    return { success: false, error };
  }
};

// ADMIN FACING EMAILS
export const sendAdminNewOrderNotification = async (order: any, user: any) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'softberryskincare@gmail.com';
    console.log('📧 Sending NEW ORDER notification to admin:', adminEmail);
    
    const template = emailTemplates.adminNewOrderNotification(order, user);
    const result = await sendEmail(adminEmail, template.subject, template.html);
    
    console.log(result.success ? '✅ Admin notified' : '❌ Failed');
    return result;
  } catch (error) {
    console.error('❌ sendAdminNewOrderNotification error:', error);
    return { success: false, error };
  }
};

export const sendAdminStatusUpdateSummary = async (order: any, user: any) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'softberryskincare@gmail.com';
    console.log('📧 Sending STATUS UPDATE summary to admin:', adminEmail);
    
    const template = emailTemplates.adminStatusUpdateSummary(order, user);
    const result = await sendEmail(adminEmail, template.subject, template.html);
    
    console.log(result.success ? '✅ Admin summary sent' : '❌ Failed');
    return result;
  } catch (error) {
    console.error('❌ sendAdminStatusUpdateSummary error:', error);
    return { success: false, error };
  }
};
