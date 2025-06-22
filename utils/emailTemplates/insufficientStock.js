// 📁 utils/emailTemplates/insufficientStock.js

module.exports = function insufficientStockTemplate({ user, product, order }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #ff5722;">⚠️ Stock Alert</h2>
      <p>Admin,</p>
      <p>User <strong>${user.name}</strong> (<a href="mailto:${user.email}">${user.email}</a>) tried to place an order but the stock is insufficient.</p>

      <h3>🔍 Order Info:</h3>
      <ul>
        <li><strong>Product:</strong> ${product.title}</li>
        <li><strong>Requested Qty:</strong> ${order.count}</li>
        <li><strong>Available Qty:</strong> ${product.quantity}</li>
        <li><strong>Order ID:</strong> ${order._id}</li>
      </ul>

      <p>Please take action on stock and inform the user.</p>

      <p>Thanks,<br/>Ecomzy System</p>
    </div>
  `;
};
