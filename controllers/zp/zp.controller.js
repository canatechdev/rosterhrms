const authService=require("../../services/zp/zp.service");

// not impelemented yet
// add zp wise cadre 
exports.addCadre = async (req, res) => {
    try {
        const { department_id, description, cadre_name} = req.body;

        if (!department_id || !description || !cadre_name) {
            return res.status(400).json({ message: "All fields are required" });
        }
console.log(req.body);
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

        if (!department_id || !description || !cadre_name) {
            return res.status(400).json({ message: "All fields are required" });
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
        const cadre_post = await authService.addCadrePost(cadre_id, post_id, level_order, total_posts, zp_id);
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
        return res.status(200).json({
            message: "Cadre Posts fetched successfully",
            cadre_posts
        });
    } catch (error) {
        console.error("Error in getCadrePostByCadreId:", error);
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




