exports.orderConfirmationTemplate = ({ userName, orders, totalAmount }) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #4CAF50;">🛍️ Thank you for your purchase, ${userName}!</h2>
      <p>Your payment was successful and your order has been placed.</p>
      
      <h3>📦 Order Details:</h3>
      <ul>
        ${orders.map(order => `
          <li>
            <strong>${order.title}</strong> - Qty: ${order.count} - ₹${order.price} <br/>
          </li>
        `).join('')}
      </ul>

      <p><strong>Total Paid:</strong> ₹${totalAmount}</p>

      <p>📍 Shipping To:<br/>
        ${userName},<br/>
        ${orders[0].shippingAddress.address},<br/>
        ${orders[0].shippingAddress.city} - ${orders[0].shippingAddress.pincode}<br/>
        Phone: ${orders[0].shippingAddress.phone}
      </p>

      <p style="margin-top: 20px;">We will notify you when your order is shipped. Track your order anytime in your account dashboard.</p>

       <p>Thanks,<br/>Team Ecomzy</p>
    </div>
  `;
};
