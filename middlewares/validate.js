import Joi from "joi";

export function validateUser(user, key) {
    const schema = Joi.object({
        name: key ? Joi.string().optional().max(200) : Joi.string().required().max(200),
        email: key ? Joi.string().optional() : Joi.string().email().required(),
        password: key ? Joi.string().optional() : Joi.string().required(),
        phone: Joi.string().optional().allow(''),
        role: Joi.string().optional().allow(''),
        image: Joi.string().optional().allow(''),
        isActive: Joi.string().optional()
    });
    return schema.validate(user);
};

export function validateFood(food, key) {
    const schema = Joi.object({
        name: key ? Joi.string().optional().max(200) : Joi.string().required().max(200),
        unit_cost: key ? Joi.number().optional() : Joi.number().required(),
        cooking_duration: key ? Joi.number().optional() : Joi.number().required(),
        unit: key ? Joi.string().optional() : Joi.string().required(),
        images: Joi.any().allow(),
        rating: Joi.number().optional().allow('')
    });
    return schema.validate(food);
};

export function validateOrder(order) {
    const schema = Joi.object({
        name: Joi.string().required(),
        reference: Joi.number().required(),
        amount: Joi.number().required(),
        payment: Joi.string().required(),
        status: Joi.string().required(),
        delivery: Joi.string().required(),
        address: Joi.string().optional().max(200),
        owner: Joi.string().required(),
        cook: Joi.string().optional(),
        rating: Joi.string().optional().allow('')
    });
    return schema.validate(order);
}