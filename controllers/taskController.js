const Task = require("../models/Task");


// const Task = require("../models/Task");
const Staff = require("../models/User");
const nodemailer = require("nodemailer");

// exports.createTask = async (req, res) => {
//   try {
//     const { taskName, description, scheduledTime, role, assignedTo, assignedBy, status, repeat } = req.body;

//     if (!assignedBy) {
//       return res.status(400).json({ error: "assignedBy is required" });
//     }

//     console.log(req.body, "📥 Incoming Task Payload");

//     // ✅ 1. Validate assignedBy & assignedTo exist in DB

//     const assignedByUser = await Staff.findById(assignedBy).select("username email");
//     const assignedToUser = await Staff.findById(assignedTo).select("name email");

// console.log(assignedByUser,"assignedByUserrrrrrr");
//     console.log(assignedToUser,"assignedToUserrrrrrr");


//     if (!assignedByUser) {
//       return res.status(400).json({ error: "Invalid assignedBy user" });
//     }
//     if (!assignedToUser) {
//       return res.status(400).json({ error: "Invalid assignedTo user" });
//     }

//     // ✅ 2. Create Task
//     const task = new Task({
//       taskName,
//       description,
//       scheduledTime,
//       role,
//       assignedTo,
//       assignedBy,
//       status: status || "pending",
//       repeat: repeat || "once",
//     });

//     await task.save();

//     // ✅ 3. Populate assignedTo & assignedBy for response
//     const populatedTask = await task.populate([
//       { path: "assignedTo", select: "name email" },
//       { path: "assignedBy", select: "name email" },
//     ]);

//     console.log(populatedTask, "✅ Task Created & Populated with assignedBy");

//     // ✅ 4. Send email notification to assignedTo user
//     try {
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.SMTP_EMAIL,
//           pass: process.env.SMTP_PASSWORD,
//         },
//       });

//       const mailOptions = {
//         from: process.env.SMTP_EMAIL,
//         to: assignedToUser.email,
//         subject: `New Task Assigned: ${taskName}`,
//         html: `
//           <h2>Hello ${assignedToUser.name},</h2>
//           <p>You have been assigned a new task by <strong>${assignedByUser.name}</strong>.</p>
//           <p><strong>Task:</strong> ${taskName}</p>
//           <p><strong>Description:</strong> ${description || "No description"}</p>
//           <p><strong>Scheduled:</strong> ${new Date(scheduledTime).toLocaleString()}</p>
//           <p><strong>Status:</strong> ${status || "pending"}</p>
//           <br>
//           <p>Login to your dashboard to view details.</p>
//         `,
//       };

//       await transporter.sendMail(mailOptions);
//       console.log(`📧 Email sent to ${assignedToUser.email}`);
//     } catch (emailErr) {
//       console.error("❌ Failed to send email:", emailErr);
//     }

//     res.status(201).json(populatedTask);
//   } catch (err) {
//     console.error("❌ Error creating task:", err);
//     res.status(500).json({ error: "Failed to create task" });
//   }
// };


exports.createTask = async (req, res) => {
  try {
    const { taskName, description, scheduledTime, role, assignedTo, assignedBy, status,repeat, company } = req.body;

    if (!assignedBy) {
      return res.status(400).json({ error: "assignedBy is required" });
    }
   if (!company || !company.id || !company.name) {
      return res.status(400).json({ error: "company id and name are required" });
    }

 // ✅ 1. Check if a similar task already exists
    const existingTask = await Task.findOne({
      taskName,
      assignedTo,
      scheduledTime,
      role,
      
    });

    if (existingTask) {
      return res.status(409).json({
        error: "Task already exists with the same name, assigned user, and schedule.",
        existingTask,
      });
    }
    console.log(req.body, "📥 Incoming Task Payloaddddddddddddddd");

    // ✅ 1. Create Task
    const task = new Task({
      taskName,
      description,
      scheduledTime,
      role,
      assignedTo,
      assignedBy,
       company: { id: company.id, name: company.name }, // ✅ Save both id + name
      
      status: status || "pending",
      repeat: repeat || "once",

    });

    await task.save();

    // ✅ 2. Populate assignedTo & assignedBy
    const populatedTask = await task.populate([
      { path: "assignedTo", select: "name email contactNumber" },
      { path: "assignedBy", select: "name email" },
     
    ]);

    console.log(populatedTask, "✅ Task Created & Populated");
     console.log(populatedTask, "✅ Task Created & Populated");

    // ✅ Convert populatedTask to a plain object
    const taskResponse = populatedTask.toObject();

    // ✅ Replace `company` object with just company name
    // taskResponse.company = populatedTask.company?.name || null;

    // ✅ Send email notification if user exists

    // ✅ 3. Fetch assigned user email
    const user = await Staff.findById(assignedTo).select("name email");
    console.log(user, "👤 Assigned User Detailsssss");
    
    if (!user) {
      console.warn("⚠️ Assigned user not found, skipping email.");
    } else {
      // ✅ 4. Send email notification
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.SMTP_EMAIL,
          to: user.email,
          subject: `New Task Assigned: ${taskName}`,
          html: `
            <h2>Hello ${user.name},</h2>
            <p>You have been assigned a new task.</p>
            <p><strong>Task:</strong> ${taskName}</p>
            <p><strong>Description:</strong> ${description || "No description"}</p>
            <p><strong>Scheduled:</strong> ${new Date(scheduledTime).toLocaleString()}</p>
            <p><strong>Status:</strong> ${status || "pending"}</p>
            <br>
            <p>Login to your dashboard to view details.</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${user.email}`);
      } catch (emailErr) {
        console.error("❌ Failed to send email:", emailErr);
      }
    }

    res.status(201).json(populatedTask);
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// 📊 Task Reports

exports.getTaskReports = async (req, res) => {
  try {
    // Get task counts grouped by status
    const statusCounts = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Get task counts grouped by repeat type
    const repeatCounts = await Task.aggregate([
      { $group: { _id: "$repeat", count: { $sum: 1 } } }
    ]);

    // Get task counts grouped by company
   

    // Get total tasks
    const totalTasks = await Task.countDocuments();

    res.status(200).json({
      success: true,
      totalTasks,
      statusCounts,
      repeatCounts,
      
    });
  } catch (err) {
    console.error("❌ Error fetching task reports:", err);
    res.status(500).json({ error: "Failed to fetch task reports" });
  }
};

// Get all tasks with assignedTo, assignedBy, and company name
// exports.getTasks = async (req, res) => {
//   try {
//     // Fetch all tasks and populate references
//     const tasks = await Task.find()
//       .populate({ path: "assignedTo", select: "name email" })
//       .populate({ path: "assignedBy", select: "name email" })
//       .populate({ path: "company", select: "name" })
//       .sort({ createdAt: -1 }); // optional: latest first

//       console.log(tasks,"tasksssssssssssssssssssssssssssgetalll");
//     // Transform tasks: replace company object with company name
//     const transformedTasks = tasks.map(task => {
//       const t = task.toObject();
//       t.company = task.company?.name || null;
//       return t;
//     });

//     console.log (transformedTasks, "✅ Transformed Tasks with Company Names");

//     res.status(200).json({
//       success: true,
//       totalTasks: transformedTasks.length,
//       tasks: transformedTasks,
//     });
//   } catch (err) {
//     console.error("❌ Error fetching tasks:", err);
//     res.status(500).json({ error: "Failed to fetch tasks" });
//   }
// };


















// ✅ Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    // console.log(tasks,"tasksssssssssssssssssssssssssssgetalll");
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get single task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email");
   
    
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update task
// exports.updateTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!task) return res.status(404).json({ error: "Task not found" });
//     res.json(task);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// ✅ Update task (with status change notification)
exports.updateTask = async (req, res) => {
  try {
    const { status } = req.body;

    // Find task first
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email");
    if (!task) return res.status(404).json({ error: "Task not found" });

    const oldStatus = task.status;

    // Update task fields
    task.set(req.body);
    await task.save();

    // ✅ If status is updated, send notification email
    if (status && status !== oldStatus && task.assignedTo?.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.SMTP_EMAIL,
          to: task.assignedTo.email,
          subject: `Task Status Updated: ${task.taskName}`,
          html: `
            <h2>Hello ${task.assignedTo.name},</h2>
            <p>The status of your task has been updated.</p>
            <p><strong>Task:</strong> ${task.taskName}</p>
            <p><strong>New Status:</strong> ${status}</p>
            <br>
            <p>Login to your dashboard to view full details.</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Status update email sent to ${task.assignedTo.email}`);
      } catch (emailErr) {
        console.error("❌ Failed to send status update email:", emailErr.message);
      }
    }

    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






exports.getTasksByUser = async (req, res) => {
  const {userId} = req.params;

  console.log("Fetching tasks for userIdddddddddd:",);
  

  try {
    const tasks = await Task.find({ assignedTo:userId})
      .populate("assignedTo", "name email")
       
      .sort({ createdAt: -1 });

    if (!tasks.length) {
      return res.status(200).json({ message: "No tasks assigned", tasks: [] });
    }
console.log(tasks,"taskssssssssssssssssssssssssssuserrrr");

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching user tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 📊 Task Reports Controller
exports.getTaskReports = async (req, res) => {
  try {
    console.log("📊 Fetching task reports...");

    // 1️⃣ Aggregate tasks grouped by status
    const statusAggregation = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // 2️⃣ Aggregate tasks grouped by repeat type
    const repeatAggregation = await Task.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$repeat", "once"] }, // replace null with "once"
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }
    ]);

    // 3️⃣ Aggregate tasks grouped by user (assignedTo)
    // const userAggregation = await Task.aggregate([
    //   {
    //     $group: {
    //       _id: "$assignedTo",
    //       count: { $sum: 1 },
    //     },
    //   },
    //   { $sort: { count: -1 } },
    //   { $limit: 5 } // get top 5 users with most tasks
    // ]);
     const userAggregation = await Task.aggregate([
      {
        $group: {
          _id: "$assignedTo", // group by user ID
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "staffs", // 👈 must match the collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          name: { $ifNull: ["$userDetails.name", "Unknown"] },
        },
      },
    ]);


    // 4️⃣ Get total tasks
    const totalTasks = await Task.countDocuments();

    // ✅ Convert arrays into key-value objects
    const formatResult = (arr) =>
      arr.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

    res.status(200).json({
      success: true,
      totalTasks,
      statusCounts: formatResult(statusAggregation),
      repeatCounts: formatResult(repeatAggregation),
      topUsers: userAggregation, // frontend can use this for a leaderboard
    });

    console.log("✅ Task reports fetched successfully!");
  } catch (err) {
    console.error("❌ Error fetching task reports:", err);
    res.status(500).json({ error: "Failed to fetch task reports" });
  }
};
