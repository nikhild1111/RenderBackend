// 📁 utils/emailTemplates/confirmed.js

module.exports = function confirmedTemplate({ user, product, order }) {
  const shipping = order.shippingAddress;
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #4CAF50;">✅ Your order is confirmed, ${user.name}!</h2>
      <p>We've successfully confirmed your order for:</p>
      <ul>
        <li><strong>${product.title}</strong> - Qty: ${order.count} - ₹${order.price}</li>
      </ul>
      <p><strong>Total:</strong> ₹${order.totalAmount}</p>
      <p><strong>Shipping To:</strong><br/>
        ${shipping.fullName},<br/>
        ${shipping.address}, ${shipping.city}, ${shipping.pincode}<br/>
        Phone: ${shipping.phone}
      </p>
      <p style="margin-top: 20px;">We'll notify you once your order is shipped!</p>
      <p>Thanks,<br/>Team Ecomzy</p>
    </div>
  `;
};
