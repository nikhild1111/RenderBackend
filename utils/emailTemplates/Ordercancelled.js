// 📁 utils/emailTemplates/cancelled.js

module.exports = function cancelledTemplate({ user, product, order }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #f44336;">❌ Order Cancelled</h2>
      <p>Hi ${user.name},</p>
      <p>We're sorry to inform you that your order for <strong>${product.title}</strong> has been cancelled.</p>

      <p><strong>Order ID:</strong> ${order._id}</p>

      <p>💰 If you have already made a payment, the refund will be processed within <strong>5–7 business days</strong> to your original payment method.</p>

      <p>If you believe this was a mistake or have any questions, feel free to reach out to our support team.</p>

      <p>Thanks,<br/>Team Ecomzy</p>
    </div>
  `;
};
