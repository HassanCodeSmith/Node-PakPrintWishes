const addProduct = (name, price, description) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Product Added</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        h2 {
            color: #333;
        }

        p {
            color: #666;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            background-color: #007BFF;
            color: #fff;
            border-radius: 5px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>New Product Added</h2>
        <p>Hello Admin,</p>
        <p>We are excited to inform you that a new product has been added to our inventory.</p>
        <p><strong>Product Details:</strong></p>
        <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Price:</strong> ${price}</li>
            <li><strong>Description:</strong> ${description}</li>
           
        </ul>
        <p>Thank you!.</p>
        <p>Best regards,</p>
        <p>Pak Printwishes</p>
    </div>
</body>

</html>


`;
};

module.exports = addProduct;
