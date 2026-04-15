export const PROFILE_STEPS = {
    "PERSONAL_INFO": [ //भाग १,२,३,४,५,६,१४(रहिवासी पत्ता),१५,१६,१७,१८
        {
            step: 1,
            fields: ["salutation", "first_name", "middle_name", "last_name", "full_name_marathi", "father_full_name", "mother_full_name", "name_changed", "previous_name", "blood_group", "gender", "dob", "phone", "pan_number", "aadhar_number", "email", "govt_email", "religion", "caste_id", "caste_validity_cert", "caste_validity_date", "mother_tongue"],
            required: ["first_name", "last_name"]
        },
        {
            step: 2,
            fields: ["first_appointment_type", "cadre_service_name", "dept_entry_exam_date", "govt_service_joining_date", "current_office_joining_date", "retirement_date", "sevarth_number", "shaalarth_number", "height_cm", "identification_mark"],
            required: ["first_name", "last_name"]
        },
        {
            step: 3,
            fields: ["is_ex_serviceman", "has_domicile_cert", "spouse_in_service", "spouse_service_type", "spouse_office_type", "spouse_office_details", "spouse_employee_no", "has_pran", "pran_number", "gpf_number", "ppo_number", "ppo_date", "marital_status"],
            required: ["first_name", "last_name"]
        },
        {// FILES
            step: 4,
            fields: [
                "marriage_cert", "birth_cert", "aadhar", "pan", "caste_validity", "gazette_name_change", "photo", "signature"
            ],
            required: ["first_name", "last_name"]
        },
        {// ADDRESS 2 - रहिवासी पत्ता & current
            step: 5,
            fields: [
                "address_type", "address_line", "post_office", "city", "district", "taluka", "pin_code", "mobile", "std_code", "phone_number", "is_govt_residence", "residing_since"
            ],
            required: ["first_name", "last_name"]
        },
        {// EMERGENCY CONTACT
            step: 6,
            fields: [
                "contact_name", "relation", "mobile", "alt_contact_name", "alt_mobile", "std_code", "phone_number", "home_std_code", "home_phone_number", "residing_since"
            ],
            required: ["first_name", "last_name"]
        },
        {// FAMILY INFO multi
            step: 7,
            fields: [
                "salutation", "first_name", "middle_name", "last_name", "dob", "relation"
            ],
            required: ["first_name", "last_name"]
        },

        {// NOMINEE INFO 
            step: 8,
            fields: [
                "nomination_type", "nominee_name", "middle_name", "relation_to_employee", "nominee_age", "share_percentage", "contingency_event", "alternate_nominee_name", "alternate_nominee_relation", "alternate_nominee_address"
            ],
            required: ["first_name", "last_name"]
        },

    ],

    "EDUCATION": [ //अर्हता माहिती ७.शैक्षणिक अर्हता २१,२२,२३,२५(इतर परीक्षा)  + FILE UPLOAD 7
        {
            step: 1,
            fields: ["edu_type", "institution", "qualification", "pass_year", "obtained_at",
                "passing_cert", "course_name", "tr_institution", "coordinator", "start_date", "end_date", "training_type", "training_cert", "dp_exam_name", "dp_status", "dp_pass_date", "dp_attempt_number", "cp_exam_name", "cp_status", "cp_pass_date", "cp_attempt_number"],
            required: []
        },
        {
            step: 2,
            fields: ["computer_passed", "computer_exempted", "computer_pass_date", "computer_exempt_date", "computer_institution", "computer_cert_no", "marathi_typing_passed", "marathi_typing_exempted", "marathi_typing_wpm", "marathi_typing_pass_date", "marathi_typing_exempt_date", "marathi_typing_institution", "marathi_typing_cert_no", "english_typing_passed", "english_typing_exempted", "english_typing_wpm", "english_typing_pass_date", "english_typing_exempt_date", "english_typing_institution", "english_typing_cert_no", "increment_withheld_typing", "recovery_done",
                "marathi_lang_passed", "marathi_lang_exempted", "marathi_lang_pass_date", "marathi_lang_exempt_date", "hindi_lang_passed", "hindi_lang_exempted", "hindi_lang_pass_date", "hindi_lang_exempt_date",
                "computer_exam_cert", "marathi_typing_cert", "english_typing_cert", "marathi_exam_cert", "hindi_exam_cert"],
            required: []
        },
    ],

    "SERVICE_INFO": [   // सेवाविषयक महिती ८,९,१०,२४
        {
            step: 1,
            fields: ["appointment_route", "social_reservation", "parallel_reservation", "order_number", "order_date", "is_district_transfer", "posting_location_type", "panchayat_samiti", "dept_level", "office_name", "post_name", "post_group", "joining_date", "pay_commission", "pay_scale", "grade_pay", "basic_pay", "appointment_category", "medical_done", "medical_date", "assets_submitted", "assets_submitted_date", "appointment_order_cert"],
            required: []
        },
        {
            step: 2,
            fields: ["employment_type", "status_date", "probation_applicable", "probation_start_date", "probation_end_date", "probation_completed", "probation_order_date", "probation_order_number", "has_permanency_cert", "permanency_cert_date", "permanent_from_date", "permanent_post_name", "probation_cert", "permanent_benefit_cert"],
            required: []
        },
        {
            step: 3, // 3 iterations 10-12/20-24/30
            fields: ["years_required", "benefit_no", "service_completion_date", "benefit_received","benefit_date", "due_date", "order_number", "order_date"],
            required: []
        },
        {
            step: 4,
            fields: ["chattopadhyay_granted", "chattopadhyay_order_no", "chattopadhyay_order_date", "nivadshreeni_order_no", "nivadshreeni_order_date", "year", "submitted", "submitted_date", "asset_liability_cert"],
            required: []
        },
    ],
    "TRANSFER_INFO": [  // बदली बदल माहिती १९
        {
            step: 1,
            fields: [
                "transfer_type", "transfer_category", "order_date", "is_current_posting", "is_district_transfer", "posting_location_type", "panchayat_samiti", "dept_level", "office_name", "post_name", "is_gazetted", "joining_date", "end_date"],
            required: []
        },

    ],
    "PROMOTION_INFO": [  // बदली बदल माहिती २०
        {
            step: 1,
            fields: ["promotion_type", "promotion_category", "order_date", "is_current_posting", "is_district_transfer", "posting_location_type", "panchayat_samiti", "dept_level", "office_name", "post_name", "is_gazetted", "joining_date", "end_date"],
            required: []
        },

    ],
    "SERVICE_EXTENSION_INFO": [  // सेवा मुदतवाढ माहिती २०
        {
            step: 1,
            fields: ["extension_granted", "extension_order_no", "extension_order_date", "increment_withheld", "withheld_from", "withheld_to", "withheld_order_date", "withheld_order_no", "withheld_order_cert"],
            required: []
        },

    ],
    "DISABILITY_INFO": [  // दिव्यांग कर्मचारी माहीती २५
        {
            step: 1,
            fields: ["is_disabled", "examiner_name", "has_udid", "udid_number", "disability_type", "disability_percentage", "exam_date", "is_permanent", "temp_from", "temp_to", "transport_allowance", "profession_tax_exempt", "equipment_provided", "equipment_name", "cert_date", "disability_cert"],
            required: []
        },

    ],
    "GROUP_INSURANCE": [  // गटविमा माहिती २७
        {
            step: 1,
            fields: ["year", "entry_date", "amount", "group_insurance_cert"],
            required: []
        },

    ],
    "DISCUSSION_INFO": [  // चौकशी माहिती २८,३०,३१,३२
        {
            step: 1,
            fields: ["from_date", "to_date", "action_taken", "absence_cert", "inquiry_active", "inquiry_from", "final_decision", "decision_details", "disciplinary_start_date", "inquiry_officer_date", "penalty_order_number", "penalty_type", "penalty_order_date", "penalty_order_cert"
            ],
            required: []
        },
        {
            step: 2,
            fields: [
                "was_suspended", "suspension_date", "suspension_duration", "suspension_reason", "criminal_case_filed", "subsistence_allowance_pct", "disciplinary_action_date", "inquiry_officer_date", "reinstatement_order_date", "reinstatement_joining_date", "suspension_period_decision", "order_number", "order_date", "order_cert",
                "case_active", "court_name", "order_number", "order_date", "order_cert"],
            required: []
        },

    ],
    "ADVANCES_INFO": [  // अग्रिम माहिती ३५ 
        {
            step: 1,
            fields: ["advance_type", "advance_details", "amount", "fully_repaid", "repaid_cert_no", "repaid_cert_date"],
            required: []
        },

    ],
    "MEDICAL_CONDITIONS": [  // आजार बदल व इतर माहिती ३४
        {
            step: 1,
            fields: [
                "has_brain_thalassemia_child", "has_chromosomal_disorder_child", "has_paralysis", "has_mentally_disabled_child", "has_kidney_dialysis", "has_cancer", "is_veteran_spouse_widow", "is_abandoned_divorced_woman", "other_conditions"],
            required: []
        },

    ],
    "SERVICE_BOOK_INFO": [  // सेवापुस्तक माहिती १४,३३
        {
            step: 1,
            fields: [
                "duplicate_received", "is_updated", "verification_type", "service_book", "verification_date", "verification_cert"
            ],
            required: []
        },

    ],
    "CERTIFICATE_INFO": [  // प्रमाणपत्रे माहिती २६
        {
            step: 1,
            fields: [
                "character_antecedents", "constitution_oath", "home_village_decl", "medical_cert", "small_family_pledge", "undertaking", "medical_reimbursement_option", "nps_family_pension_option"
            ],
            required: []
        },

    ],

}