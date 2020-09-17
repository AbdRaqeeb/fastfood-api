import Joi from "joi";

export function validateUser(user, key) {
    const schema = Joi.object({
        name: key ? Joi.string().optional().max(200) : Joi.string().required().max(200),
        email: key ? Joi.string().optional() : Joi.string().email().required(),
        password: key ? Joi.string().optional().min(6) : Joi.string().required().min(6),
        phone: Joi.string().optional().allow(''),
        role: Joi.string().optional().allow(''),
        image: Joi.any().optional().allow(''),
        isActive: Joi.string().optional()
    });
    return schema.validate(user);
}

export function validateFood(food, key) {
    const schema = Joi.object({
        name: key ? Joi.string().optional().max(200) : Joi.string().required().max(200),
        unit_cost: key ? Joi.number().optional() : Joi.number().required(),
        cooking_duration: Joi.number().optional(),
        category_id: key ? Joi.number().optional() : Joi.number().required(),
        unit: key ? Joi.string().optional() : Joi.string().required(),
        images: Joi.any().allow().optional(),
        rating: Joi.number().optional().allow('')
    });
    return schema.validate(food);
}

export function validateOrder(order) {
    const schema = Joi.object({
        amount: Joi.number().required(),
        payment: Joi.string().required(),
        status: Joi.string().optional(),
        delivery: Joi.string().optional(),
        address: Joi.string().optional().max(200),
        cook: Joi.string().optional(),
        rating: Joi.string().optional().allow(''),
        phone: Joi.string().required(),
        data: Joi.array().items(Joi.object()).required(),
        comments: Joi.string().optional().allow('')
    });
    return schema.validate(order);
}

export function validateLogin(user) {
    const schema = Joi.object({
        email: Joi.string().required().max(200),
        password: Joi.string().required().min(6)
    });
    return schema.validate(user);
}

export function validateCategory(category, key) {
    const schema = Joi.object({
        name: key ? Joi.string().optional().max(100) : Joi.string().required().max(100),
        description: Joi.string().optional().max(200),
        image: Joi.any().optional()
    });
    return schema.validate(category);
}

export function validatePassword(password) {
    const schema = Joi.object({
        old_password: Joi.string().required().max(200).min(6),
        new_password: Joi.string().required().max(200).min(6),
    });
    return schema.validate(password);
}