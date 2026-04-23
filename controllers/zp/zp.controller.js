const zpService = require('../../services/zp/zp.service.js');
const asyncHandler = require('../../middlewares/async_handler.js');

// ZP CRUD
exports.createZp = asyncHandler(async (req, res) => {
    const { name, district_id,name_mr } = req.body;
    const zp = await zpService.createZp(name, district_id,name_mr);
    res.status(201).json({ success: true, data: zp });
});

exports.getZps = asyncHandler(async (req, res) => {
    const zps = await zpService.getZps();
    res.status(200).json({ success: true, data: zps });
});

exports.getZpById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const zp = await zpService.getZpById(id);
    if (!zp) {
        return res.status(404).json({ success: false, message: 'Zp not found' });
    }
    res.status(200).json({ success: true, data: zp });
});

exports.updateZp = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, district_id, status,name_mr } = req.body;
    const zp = await zpService.updateZp(id, name, district_id, status,name_mr);
    if (!zp) {
        return res.status(404).json({ success: false, message: 'Zp not found' });
    }
    res.status(200).json({ success: true, data: zp });
});

exports.deleteZp = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await zpService.deleteZp(id);
    res.status(200).json({ success: true, message: 'Zp deleted successfully' });
});

// add department by zp 
exports.addDepartment = async(req,res)=>{
    try{
        const{name,name_mr} = req.body;
        if(!name){
            return res.status(400).json({message:"Department name is required"});
        }
        console.log("Request body:", req.body);
        const zp_id = req.user.zp_id;
        console.log("zp_id",zp_id);
        if(!zp_id){
            return res.status(400).json({message:"Invalid ZP ID ZP ID is required to add department"});
        }
        const department = await zpService.addDepartment(name,zp_id,name_mr);
        return res.status(201).json({
            message:"Department added successfully",
            department
        });
    }catch(error){
        console.log("Error in addDepartment:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
// get department by zp wise
exports.getDepartmentByZP = async(req,res)=>{
    try{
        const zp_id = req.user.zp_id;
        console.log("zp_id",zp_id);
        console.log("GET DEPARTMENT HIT");
        const departments = await zpService.getDepartmentByZP(zp_id);
        if(!departments || departments.length === 0){
            return res.status(404).json({message:"No departments found"});
        }
        return res.status(200).json({
            message:"Departments fetched successfully",
            departments
        });
    }catch(error){
        console.log("Error in getDepartmentByZP:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
    }   
// get department by id
exports.getDepartmentById = async(req,res)=>{
    try{
        const department_id = req.params.id;
        const department = await zpService.getDepartmentById(department_id);
        if(!department){
            return res.status(404).json({message:"Department not found"});
        }
        return res.status(200).json({
            message:"Department fetched successfully",
            department
        });
    }catch(error){
        console.log("Error in getDepartmentById:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
// update department
exports.updateDepartment = async(req,res)=>{
    try{
        const department_id = req.params.id;
        const {name,name_mr} = req.body;
        if(!name){
            return res.status(400).json({message:"Department name is required"});
        
        }
        const department = await zpService.updateDepartment(department_id,name,name_mr);
        if(!department){
            return res.status(404).json({message:"Department not found"});
        }
        return res.status(200).json({
            message:"Department updated successfully",
            department
        });
    }catch(error){
        console.log("Error in updateDepartment:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
// delete department
exports.deleteDepartment = async(req,res)=>{
    try{
        const department_id = req.params.id;
        const department = await zpService.deleteDepartment(department_id);
        if(!department_id){
            return res.status(404).json({message:"Department Not Found"});
        }
        return res.status(200).json({
            message:"Department deleted successfully",
            department
        });
    }catch(error){
        console.log("Error in deleteDepartment:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

// add zp wise cadre 
exports.addCadre = async (req, res) => {
    try {
        const { department_id, description, cadre_name,cadre_name_mr,description_mr, cadre_group} = req.body;

        if (!department_id || !description || !cadre_name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const zp_id = req.user.zp_id;
        console.log("zp_id",zp_id);

        const cadre = await zpService.addCadre(
            department_id,
            description,
            cadre_name,
            cadre_name_mr,
            description_mr,
            zp_id,
            cadre_group
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
        const zp_id = req.user.zp_id;

        const cadre = await zpService.getCadre(zp_id);
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

        const cadre = await zpService.getCadreById(cadre_id);

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
        const { department_id, description, cadre_name,cadre_name_mr,description_mr, cadre_group } = req.body;

        if (!department_id && !description && !cadre_name) {
            return res.status(400).json({
                message: "At least one field is required to update"
            });
        }
        const cadre = await zpService.updateCadre(
            cadre_id,
            department_id,
            description,
            cadre_name,
            cadre_name_mr,
            description_mr,
            cadre_group
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

        const cadre = await zpService.deleteCadre(cadre_id);

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
        const {designation,designation_mr, department_id,cadre_id,level_order,total_posts } = req.body;
        if (!designation || !department_id || !cadre_id || !level_order || !total_posts ) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const zp_id = req.user.zp_id;
        const post = await zpService.addPost(designation,designation_mr, department_id, zp_id,cadre_id,level_order,total_posts);
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
        const zp_id = req.user.zp_id;
        const posts = await zpService.getPostByZP(zp_id);
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
        const post = await zpService.getPostById(post_id);
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
        const { designation,designation_mr, department_id, cadre_id, level_order, total_posts } = req.body;

        if (!designation || !designation_mr || !department_id || !cadre_id || !level_order || !total_posts) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const data = await zpService.updatePost(
            post_id,
            designation,
            designation_mr,
            department_id,
            cadre_id,
            level_order,
            total_posts
        );

        if (!data) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({
            message: "Post updated successfully",
            data
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

        const data = await zpService.deletePost(post_id);

        if (!data) {
            return res.status(404).json({ message: "Post not found or already deleted" });
        }

        return res.status(200).json({
            message: "Post deleted successfully",
            data
        });

    } catch (error) {
        console.error("Error in deletePost:", error);
        return res.status(500).json({ message: error.message });
    }
};

    // add roster template
exports.addRosterTemplate = async (req, res) => {
try{
    const {point_no,caste_id} = req.body;
    if(!point_no || !caste_id){
        return res.status(400).json({message:"All fields are required"});
    }
    const zp_id = req.user.zp_id;
    const roster_template = await zpService.addRosterTemplate(point_no,caste_id,zp_id);
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
        const zp_id = req.user.zp_id;

        console.log("zp id", zp_id);
        console.log("user id", req.user.user_id);

        const roster_templates = await zpService.getRosterTemplateByZP(zp_id);

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
        const roster_template = await zpService.getRosterTemplateById(template_id);
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
        const roster_template = await zpService.updateRosterTemplate(template_id, point_no, caste_id);
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
        const roster_template = await zpService.deleteRosterTemplate(template_id);
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


// Generate roster by ZP id 
exports.generateRosterByZP = async (req, res) => {
    try {
        const zp_id = req.user.zp_id;

        console.log("Generating roster for FULL ZP:", zp_id);

        const data = await zpService.generateRosterByZP(zp_id);

        res.json({ message: "Roster generated for all cadre posts", data });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createVacancyByZP = async (req, res) => {
    try {
        const zp_id = req.user.zp_id;

        const data = await zpService.createVacanciesByZP(zp_id);

        res.json({ message: "Vacancies created for full ZP", data });

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
        const zp_id = req.user.zp_id;
        const data = await zpService.fillVacancy(vacancy_id, user_id, zp_id);

        res.json({ message: "Vacancy filled", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getRosterByCadrePost = async (req, res) => {
    try {
        const cadre_post_id = req.params.cadre_post_id;
        const zp_id = req.user.zp_id;

        const filters = {
            caste_id: req.query.caste_id,
            status: req.query.status,
            roster_point: req.query.roster_point
        };

        const data = await zpService.getRosterByCadrePost(cadre_post_id, zp_id, filters);

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "No vacancy roster found for this cadre post"
            });
        }

        return res.status(200).json({
            message: "Roster fetched successfully",
            count: data.length,
            data
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.retireAllZPsEmployees = async (req, res) => {
    try {
        const result = await zpService.retireEmployeesForAllZPs();

        res.json({
            message: "Auto retirement completed for all ZPs",
            data: result
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.promoteEmployee = async (req, res) => {
    try {
        const { user_id, new_vacancy_id } = req.body;
        const zp_id = req.user.zp_id;

        const data = await zpService.promoteEmployee(user_id, new_vacancy_id, zp_id);

        res.json({ message: "Employee promoted successfully", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.transferEmployee = async (req, res) => {
    try {
        const { user_id, new_vacancy_id, new_zp_id } = req.body;
        const zp_id = req.user.zp_id;

        const data = await zpService.transferEmployee(user_id, new_vacancy_id, new_zp_id, zp_id);

        res.json({ message: "Employee transferred successfully", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getVacanciesByZP = async(req,res)=>{
    try{
        const zp_id = req.user.zp_id;
        const vacancies = await zpService.getVacanciesByZP(zp_id);
        if(!vacancies || vacancies.length === 0){
            return res.status(404).json({message:"No vacancies found"});
        }
        return res.status(200).json({
            message:"Vacancies fetched successfully",
            vacancies
        })
    }catch(error){
        console.error("Error in getVacanciesByZP:",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}


  
  
  // get all getZPAdmins
  exports.getZPAdmins=async(req,res)=>{
      const zp_name=req.params.zp_name;
      const zpAdmins = await zpService.getZPAdmins(zp_name);
      res.json(zpAdmins);
  }



