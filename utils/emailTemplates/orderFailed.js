// 📁 utils/emailTemplates/orderFailed.js

module.exports = function orderFailedTemplate({ user, cartItems, paymentInfo }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #f44336;">❌ Order Processing Failed</h2>
      <p>Hi ${user.name},</p>
      <p>We received your payment (₹${paymentInfo.amount || '---'}) but couldn't process your order due to an internal issue.</p>

      <h3>Items in cart:</h3>
      <ul>
        ${cartItems.map(item => `
          <li><strong>${item.title}</strong> - Qty: ${item.count} - ₹${item.price}</li>
        `).join('')}
      </ul>

      <p>💰 Your payment is safe. A refund will be initiated within <strong>5–7 business days</strong> to the original payment method.</p>

      <p>We apologize for the inconvenience. For support, contact us at <a href="mailto:support@ecomzy.com">support@ecomzy.com</a>.</p>

      <p>Thanks,<br/>Team Ecomzy</p>
    </div>
  `;
};
