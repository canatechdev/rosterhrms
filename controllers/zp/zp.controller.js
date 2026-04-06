const zpService = require('../../services/zp/zp.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

const createZp = asyncHandler(async (req, res) => {
    const { name, district_id } = req.body;
    const zp = await zpService.createZp(name, district_id);
    res.status(201).json({ success: true, data: zp });
});

const getZps = asyncHandler(async (req, res) => {
    const zps = await zpService.getZps();
    res.status(200).json({ success: true, data: zps });
});

const getZpById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const zp = await zpService.getZpById(id);
    if (!zp) {
        return res.status(404).json({ success: false, message: 'Zp not found' });
    }
    res.status(200).json({ success: true, data: zp });
});

const updateZp = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, district_id, status } = req.body;
    const zp = await zpService.updateZp(id, name, district_id, status);
    if (!zp) {
        return res.status(404).json({ success: false, message: 'Zp not found' });
    }
    res.status(200).json({ success: true, data: zp });
});

const deleteZp = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await zpService.deleteZp(id);
    res.status(200).json({ success: true, message: 'Zp deleted successfully' });
});

module.exports = {
    createZp,
    getZps,
    getZpById,
    updateZp,
    deleteZp,
};
const authService=require("../../services/zp/zp.service");

// add zp wise cadre 
exports.addCadre = async (req, res) => {
    try {
        const { department_id, description, cadre_name} = req.body;

        if (!department_id || !description || !cadre_name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const zp_id = req.user.user_id;

        const cadre = await authService.addCadre(
            department_id,
            description,
            cadre_name,
            zp_id
        );

        return res.status(201).json({
            message: "Cadre added successfully",
            cadre
        });

    } catch (error) {
        console.error("Error in addCadre:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// get cadre zp wise
exports.getCadre = async (req, res) => {
    try {
        const zp_id = req.user.user_id;

        const cadre = await authService.getCadre(zp_id);
if(!cadre || cadre.length === 0) {
            return res.status(404).json({ message: "No cadre found" });
        }
        return res.status(200).json({
            message: "Cadre fetched successfully",
            cadre 
        });

    } catch (error) {
        console.error("Error in getCadre:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// get cadre by id
exports.getCadreById = async (req, res) => {
    try {
        const cadre_id = req.params.cadre_id;

        const cadre = await authService.getCadreById(cadre_id);

        if (!cadre) {
            return res.status(404).json({ message: "Cadre not found" });
        }
        return res.status(200).json({
            message: "Cadre fetched successfully",
            cadre
        });

    } catch (error) {
        console.error("Error in getCadreById:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// update cadre
exports.updateCadre = async (req, res) => {
    try {
        const cadre_id = req.params.cadre_id;
        const { department_id, description, cadre_name } = req.body;

        if (!department_id && !description && !cadre_name) {
            return res.status(400).json({
                message: "At least one field is required to update"
            });
        }
        const cadre = await authService.updateCadre(
            cadre_id,
            department_id,
            description,
            cadre_name
        );

        if (!cadre) {
            return res.status(404).json({ message: "Cadre not found" });
        }

        return res.status(200).json({
            message: "Cadre updated successfully",
            cadre
        });

    } catch (error) {
        console.error("Error in updateCadre:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// delete cadre
exports.deleteCadre = async (req, res) => {
    try {
        const cadre_id = req.params.cadre_id;

        const cadre = await authService.deleteCadre(cadre_id);

        if (!cadre) {
            return res.status(404).json({ message: "Cadre not found" });
        }
        return res.status(200).json({
            message: "Cadre deleted successfully",
            cadre
        });

    } catch (error) {
        console.error("Error in deleteCadre:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// add zp wise post 
exports.addPost = async (req, res) => {
    try {
        const { designation, department_id } = req.body;
        if (!designation || !department_id) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const zp_id = req.user.user_id;
        const post = await authService.addPost(designation, department_id, zp_id);
        return res.status(201).json({
            message: "Post added successfully",
            post
        });
    } catch (error) {
        console.error("Error in addPost:", error);
        return res.status(500).json({ message: "Internal Server Error" });
        }
};
// get post by zp wise
exports.getPostByZP = async (req, res) => {
    try {
        const zp_id = req.user.user_id;
        const posts = await authService.getPostByZP(zp_id);
            if(!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }
        return res.status(200).json({
            message: "Posts fetched successfully",
            posts
        });
    } catch (error) {
        console.error("Error in getPostByZP:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// get post by id
exports.getPostById = async (req, res) => {
    try {
        const post_id = req.params.post_id;
        const post = await authService.getPostById(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({
            message: "Post fetched successfully",
            post
        });
    } catch (error) {
        console.error("Error in getPostById:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// update post
exports.updatePost = async (req, res) => {
    try {
        const post_id = req.params.post_id;
        const { designation, department_id } = req.body;

        if (!designation || !department_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const post = await authService.updatePost(post_id, designation, department_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({
            message: "Post updated successfully",
            post
        });

    } catch (error) {
        console.error("Error in updatePost:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// delete post
exports.deletePost = async (req, res) => {
    try {
        const post_id = req.params.post_id;

        const post = await authService.deletePost(post_id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({
            message: "Post deleted successfully",
            post
        });

    } catch (error) {
        console.error("Error in deletePost:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// add cadre post
exports.addCadrePost = async (req, res) => {
    try {
        const { cadre_id, post_id,level_order,total_posts } = req.body;
        if (!cadre_id || !post_id || !level_order || !total_posts) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const zp_id = req.user.user_id;
        const cadre_post = await authService.addCadrePost(cadre_id, post_id, zp_id, level_order, total_posts);
        return res.status(201).json({
            message: "Cadre Post added successfully",
            cadre_post
        });
    } catch (error) {
        console.error("Error in addCadrePost:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// get cadre post by zp wise
exports.getCadrePostByZP = async (req, res) => {
    try {
        const zp_id = req.user.user_id;
        const cadre_posts = await authService.getCadrePostByZP(zp_id);
        console.log("Fetched cadre posts for ZP ID", zp_id, ":", cadre_posts);
        if(!cadre_posts || cadre_posts.length === 0) {
            return res.status(404).json({ message: "No cadre posts found " });
        }
        return res.status(200).json({
            message: "Cadre Posts fetched successfully",
            cadre_posts
        });
    } catch (error) {
        console.error("Error in getCadrePostByZP:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// get cadre post by cadre id
exports.getCadrePostByCadreId = async (req, res) => {
    try {
        const cadre_id = req.params.cadre_id;
        const cadre_posts = await authService.getCadrePostByCadreId(cadre_id);
        if(!cadre_posts || cadre_posts.length === 0) {
            return res.status(404).json({ message: "Cadre Posts not found for this Cadre ID" });
        }
        return res.status(200).json({
            message: "Cadre Posts fetched successfully",
            cadre_posts
        });
    } catch (error) {
        console.error("Error in getCadrePostByCadreId:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// update cadre post
exports.updateCadrePost = async (req, res) => {
    try {
        const cadre_post_id = req.params.cadre_post_id;
        const { cadre_id, post_id, level_order, total_posts } = req.body;

        if (!cadre_post_id || isNaN(cadre_post_id)) {
            return res.status(400).json({ message: "Invalid cadre_post_id" });
        }

        if (
            cadre_id === undefined &&
            post_id === undefined &&
            level_order === undefined &&
            total_posts === undefined
        ) {
            return res.status(400).json({
                message: "At least one field is required to update"
            });
        }
        if (cadre_id !== undefined && cadre_id === "") {
            return res.status(400).json({ message: "cadre_id cannot be empty" });
        }
        const cadre_post = await authService.updateCadrePost(
            cadre_post_id,
            cadre_id,
            post_id,
            level_order,
            total_posts
        );

        if (!cadre_post) {
            return res.status(404).json({ message: "Cadre Post not found" });
        }

        return res.status(200).json({
            message: "Cadre Post updated successfully",
            cadre_post
        });

    } catch (error) {
        console.error("Error in updateCadrePost:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// delete cadre post
exports.deleteCadrePost = async (req, res) => {
    try {
        const cadre_post_id = req.params.cadre_post_id;

        const cadre_post = await authService.deleteCadrePost(cadre_post_id);

        if (!cadre_post) {
            return res.status(404).json({ message: "Cadre Post not found" });
        }
        return res.status(200).json({
            message: "Cadre Post deleted successfully",
            cadre_post
        });

    } catch (error) {   
        console.error("Error in deleteCadrePost:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
    // add roster template
exports.addRosterTemplate = async (req, res) => {
try{
    const {point_no,caste_id} = req.body;
    if(!point_no || !caste_id){
        return res.status(400).json({message:"All fields are required"});
    }
    const zp_id = req.user.user_id;
    const roster_template = await authService.addRosterTemplate(point_no,caste_id,zp_id);
    return res.status(201).json({
        message:"Roster Template added successfully",
        roster_template
    });
    }catch(error){
        console.error("Error in addRosterTemplate:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// get roster template by zp wise
exports.getRosterTemplateByZP = async (req, res) => {
    try {
        const zp_id = req.user.user_id;

        console.log("zp id", zp_id);
        console.log("user id", req.user.user_id);

        const roster_templates = await authService.getRosterTemplateByZP(zp_id);

        if (!roster_templates || roster_templates.length === 0) {
            return res.status(404).json({ message: "No roster templates found" });
        }

        return res.status(200).json({
            message: "Roster Templates fetched successfully",
            roster_templates
        });

    } catch (error) {
        console.error("Error in getRosterTemplateByZP:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// get roster template by id
exports.getRosterTemplateById = async (req, res) => {
    try{
        const template_id = req.params.template_id;
        const roster_template = await authService.getRosterTemplateById(template_id);
        if (!roster_template) {
            return res.status(404).json({ message: "Roster Template not found" });
        }
        return res.status(200).json({
            message:"Roster Template fetched successfully",
            roster_template
        });
    }catch(error){
        console.error("Error in getRosterTemplateById:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// update roster template
exports.updateRosterTemplate = async (req, res) => {
    try{
        const template_id = req.params.template_id;
        const { point_no, caste_id } = req.body;
        if (!point_no || !caste_id) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const roster_template = await authService.updateRosterTemplate(template_id, point_no, caste_id);
        if (!roster_template) {
            return res.status(404).json({ message: "Roster Template not found" });
        }
        return res.status(200).json({
            message:"Roster Template updated successfully",
            roster_template
        });
    }catch(error){
        console.error("Error in updateRosterTemplate:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// delete roster template
exports.deleteRosterTemplate = async (req, res) => {
    try{
        const template_id = req.params.template_id;
        const roster_template = await authService.deleteRosterTemplate(template_id);
        if (!roster_template) {
            return res.status(404).json({ message: "Roster Template not found" });
        }

        return res.status(200).json({
            message:"Roster Template deleted successfully",
            roster_template
        });
    }
    catch(error){
        console.error("Error in deleteRosterTemplate:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


exports.generateRoster = async (req, res) => {
    try {
        const { cadre_post_id } = req.params;
        const zp_id = req.user.user_id;

        const data = await authService.generateRoster(cadre_post_id, zp_id);

        res.json({ message: "Roster generated", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createVacancy = async (req, res) => {
    try {
        const { cadre_post_id } = req.params;
        const zp_id = req.user.user_id;

        const data = await authService.createVacancies(cadre_post_id, zp_id);

        res.json({ message: "Vacancies created", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.fillVacancy = async (req, res) => {
    try {
        const { vacancy_id } = req.params;
        const { user_id } = req.body; 
        if (!user_id) {
            return res.status(400).json({ message: "user_id is required" });
        }
        const zp_id = req.user.user_id;
        const data = await authService.fillVacancy(vacancy_id, user_id, zp_id);

        res.json({ message: "Vacancy filled", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

    




