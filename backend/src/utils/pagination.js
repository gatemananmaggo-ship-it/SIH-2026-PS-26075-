const getPagination = (req) => {
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;

    // Prevent invalid values
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    // Protect server from huge requests
    if (limit > 100) limit = 100;

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip
    };
};

const getPaginationMeta = (page, limit, total) => {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
};

module.exports = {
    getPagination,
    getPaginationMeta
};