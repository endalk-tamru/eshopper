const OrderHistoryItem = ({orderHistory}) => {
    return (
      <tr>
        <td className="align-middle">{orderHistory.productName}</td>
        <td className="align-middle">{orderHistory.quantity}</td>
        <td className="align-middle">${orderHistory.productTotalAmount}</td>
        <td className="align-middle">{new Date(orderHistory.createdAt).toLocaleDateString()}</td>
        <td className="align-middle">{orderHistory.paymentMethod}</td>      
      </tr>
    ); 
  };
  
  export default OrderHistoryItem;
  