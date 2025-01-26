const AWS = requir('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

const PRODUCT_TABLE = "products"

exports.create = async (event) => 
{
    try {
        const body = JSON.parse(event.body);
        const product = {
            ProductId: uuidv4(),
            Name: body.name,
            Description: body.description,
            Price: body.price,
            Category: body.category,
            Stock: body.stock,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString()
        }
        await dynamoDB.put({
            TableName: PRODUCT_TABLE,
            Item: product
        }).promise();
        return {
            statusCode: 201,
            body: JSON.stringify(product)
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        };
    }
}
    
exports.get = async (event) => 
{
    try {
        const { ProductId } = event.pathParameters;
        const product = await dynamoDB.get({
            TableName: PRODUCT_TABLE,
            Key: {
                ProductId
            }
        }).promise();
        if (!product.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Product not found' })
            };
        }
        

        return {
            statusCode: 200,
            body: JSON.stringify(product.Item)
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
}

exports.update = async (event) => {
    try {
        const { ProductId } = event.pathParameters;
        const product = JSON.parse(event.body);
        await dynamoDB.put({
            TableName: PRODUCT_TABLE,
            Key: {
                ProductId: ProductId
            },
            UpdateExpression: 'SET Name = :name, Description = :description, Price = :price, Category = :category, Stock = :stock, UpdatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':name': product.name,
                ':description': product.description,
                ':price': product.price,
                ':category': product.category,
                ':stock': product.stock,
                ':updatedAt': new Date().toISOString()
            }
        }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(product)
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
        
    }
}


exports.delete = async (event) => {
    try {
        const { ProductId } = event.pathParameters;
        await dynamoDB.delete({
            TableName: PRODUCT_TABLE,
            Key: {
                ProductId
            }
        }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Product deleted successfully' })
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
}



exports.list = async (event) => {
    
    try {
        const products = await dynamoDB.scan({ TableName: PRODUCT_TABLE }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(products.Items)
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
}