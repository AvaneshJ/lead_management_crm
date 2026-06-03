const Lead = require("../models/Lead");

//  Create a new lead
exports.createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// Get all leads
exports.getLeads = async (req, res, next) => {
  try {
    const { search, status, sortBy, order, page = 1, limit = 10 } = req.query;
    let query = {};

    // Search by name, email, or company
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    // Filtering
    if (status) {
      query.status = status;
    }
    // Sorting
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalLeads = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Aggregate data for dashboard
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        totalLeads,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLeads / parseInt(limit)),
      },
      stats,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

// Update a lead
exports.updateLead = async (req, res, next) => {
  try {
    let lead = await Lead.findByIdAndUpdate(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }
    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a lead
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      await lead.deleteOne();
      res.status(200).json({ success: true, data: {} });
    }
  } catch (error) {
    next(error);
  }
};
