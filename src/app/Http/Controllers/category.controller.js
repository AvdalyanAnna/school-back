const Category = require('@/app/Models/category.js')
const Course = require('@/app/Models/course.js')

class CategoryController {
    async getAll(req, res) {
        const categories = await Category.findAll()
        return res.json(categories)
    }

    async getOne(req, res) {
        const { slug } = req.params
        const category = await Category.findOne({
            where: { slug },
        })
        return res.json(category)
    }

    async getCourses(req, res) {
        const { slug } = req.params
        const category = await Category.findOne({
            where: { slug },
            include: [
                {
                    model: Course,
                    as: 'courses',
                    attributes: ['id', 'title', 'description', 'slug', 'image'],
                },
            ],
        })
        return res.json(category)
    }
    async create(req, res) {
        const { title, slug, description } = req.body
        let image = null
        if (req.files[0]) image = req.files[0].filename
        const candidate = await Category.findOne({
            where: { slug },
        })
        if (candidate) {
            return res
                .status(400)
                .json({ message: 'Категория с таким slug уже существует' })
        }
        try {
            const category = await Category.create({
                title,
                slug,
                description,
                image,
            })
            return res.json({
                category,
                success: true,
                message: 'Категория успешно создана',
            })
        } catch (e) {
            res.json({
                success: false,
                message: 'Ошибка при создании категории',
            })
        }
    }
    async update(req, res) {
        const { id } = req.params
        const { title, slug, description } = req.body
        let image = null
        if (req.files[0]) image = req.files[0].filename
        try {
            const candidate = await Category.findOne({
                where: { id },
            })
            if (candidate && candidate.id === +id) {
                if (!image) image = candidate.image
                const category = await Category.update(
                    { title, slug, description, image },
                    { where: { id } }
                )
                return res.status(200).json({
                    success: true,
                    message: 'Категория поменялась',
                })
            }
            res.json({
                success: false,
                message: 'Категория не найдена',
            })
        } catch (e) {
            res.json({
                success: false,
                message: 'Ошибка при создании категории',
            })
        }
    }
    async destroy(req, res) {
        const { id } = req.params
        try {
            const candidate = await Category.findOne({
                where: { id },
            })
            if (candidate && candidate.id === +id) {
                await Category.destroy({
                    where: { id },
                }) 
                res.json({
                    success: true,
                    message: 'категория удалена',
                })
            }

            res.json({
                success: false,
                message: 'Ошибка при удалении категории',
            })
        } catch (e) {
            res.json({
                success: false,
                message: 'Ошибка при удалении категории',
            })
        }
    }
}

module.exports = new CategoryController()
