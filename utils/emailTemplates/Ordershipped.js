// 📁 utils/emailTemplates/shipped.js

module.exports = function shippedTemplate({ user, product, order }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #2196F3;">📦 Your order is on the way, ${user.name}!</h2>
      <p>Your order for <strong>${product.title}</strong> has been shipped.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p>Track your delivery in your dashboard. We hope you enjoy your purchase!</p>
      <p>Thanks,<br/>Team Ecomzy</p>
    </div>
  `;
};
