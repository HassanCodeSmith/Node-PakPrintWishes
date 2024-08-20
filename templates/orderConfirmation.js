const orderConfirm = (user_name, address, shipping, subTotal, total) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            text-align: center;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
        }

        p {
            color: #555;
        }

        table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f2f2f2;
        }

        .total {
            font-weight: bold;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Order Confirmation</h1>
        <p>Dear ${user_name},</p>
        <p>Thank you for placing your order with us! Your order will be delivered soon at ${address}</p>

       <p>Here are the your bill details:</p>

        <p>Shipping Fee: ${shipping}</p>

        <p>Sub Total: ${subTotal}

        <p class="total">Total Bill: ${total}</p>

        <p>Thank you for choosing our services. If you have any questions, feel free to contact us.</p>

        <p>Best regards,<br>Team Pak PrintWishes</p>
    </div>
</body>
</html>

`;
};

module.exports = orderConfirm;
