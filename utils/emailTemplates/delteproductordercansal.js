// 📁 utils/emailTemplates/orderCancelled.js

module.exports = function orderCancelledTemplate({ user, productTitle, order }) {
  const shipping = order.shippingAddress || {};
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #e74c3c;">❌ Your order has been cancelled, ${user.name}.</h2>
      <p>We're sorry to inform you that the following product is no longer available:</p>
      <ul>
        <li><strong>${productTitle}</strong> - Qty: ${order.count} - ₹${order.price}</li>
      </ul>
      <p><strong>Total:</strong> ₹${order.totalAmount}</p>

      <p><strong>Original Shipping Address:</strong><br/>
        ${shipping.fullName || ''},<br/>
        ${shipping.address || ''}, ${shipping.city || ''}, ${shipping.pincode || ''}<br/>
        Phone: ${shipping.phone || ''}
      </p>

      <p style="margin-top: 20px;">If you’ve already made a payment, a refund will be initiated shortly (if applicable).</p>
      <p>We apologize for the inconvenience caused.</p>
      
      <p>Thanks,<br/>Team Ecomzy</p>
    </div>
  `;
};
