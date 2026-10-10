import expenseModel from "../models/expenseModel.js";

import getDateRange from "../utils/dateFilter.js";

import XLSX from 'xlsx';

// add expense

export async function addExpense(req,res)
{
    const userId = req.user._id;

    const {description, amount, category, date } = req.body;

    try{
        if(!description || !amount || !category || !date)
        {
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            });
        }

        const newExpense = new expenseModel({
        userId,
        description,
        amount,
        category,
        date : new Date(date)
        
      });

      await newExpense.save();

      res.json({
        success : true,
        message : "Expense added successfully",
        expense : newExpense
      });
    }

    catch(err)
    {
       console.log(err);
       res.status(500).json({
        success : false,
        message : "Server error"
       });
    }
}

// get all expense 

export async function getAllExpense(req,res)
{
    const userId = req.user._id;

    try{
        const expense = await expenseModel.find({userId}).sort({date : -1});  // latest income will be shown first, so we are sorting the data in descending order of date
        res.json({
            success : true,
            expense
        });
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({
            success : false,
            message : "Error fetching expense",
            error : err.message
        });
    }
}


// to update the expense 

export async function updateExpense(req,res)
{
    const userId = req.user._id;
    const { id } = req.params;
    const { description, amount } = req.body;

    try{
        const updatedExpense = await expenseModel.findOneAndUpdate(
            { _id: id, userId },
            { description, amount },
            { new: true }
        );

        if(!updatedExpense)
        {
            return res.status(404).json({
                success : false,
                message : "expense not found"
            });
        }

        res.json({
            success : true,
            message : "expense updated successfully",
            data: updatedExpense
        });
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({
            success : false,
            message : "Error updating expense",
            error : err.message
        });
    }
}

// delete an expense

export async function deleteExpense(req,res)
{
    try{
        const expense = await expenseModel.findByIdAndDelete({ _id: req.params.id });

        if(!expense)
        {
            return res.status(404).json({
                success : false,
                message : "expense not found"
            });
        }

        // await income.remove();

        res.json({
            success : true,
            message : "expense deleted successfully"
        });
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({
            success : false,
            message : "Error deleting expense",
            error : err.message
        });
    }
}

// download excel for expense

export async function downloadExpense(req, res) {
    const userId = req.user._id;

    try {
        const expense = await expenseModel
            .find({ userId })
            .sort({ date: -1 });

        const plainData = expense.map((exp) => ({
            Description: exp.description,
            Amount: exp.amount,
            Category: exp.category,
            Date: new Date(exp.date).toLocaleDateString(),
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(plainData);

        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Expenses"
        );

        // Generate Excel file as a Buffer
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "buffer",
        });

        // Send Excel file to frontend
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="Expense_Detail.xlsx"'
        );

        res.send(excelBuffer);
    } catch (err) {
        console.log("Download expense error:", err);

        res.status(500).json({
            success: false,
            message: "Error downloading expense data",
            error: err.message,
        });
    }
}

// to get the overview of expense

export async function getExpenseOverview(req,res)
{
    try{
        const userId = req.user._id;
        const { range = "monthly"} = req.query;  // default range is monthly
        const { start, end } = getDateRange(range);
        const expense = await expenseModel.find({
            userId,
            date : {
                $gte : start,
                $lte : end
            }

        }).sort({date : -1});  // latest income will be shown first, so we are sorting the data in descending order of date

        const totalExpense = expense.reduce((acc, curr) => acc + curr.amount, 0);
        const averageExpense = expense.length > 0 ? totalExpense / expense.length : 0;
        const numberOfTransactions = expense.length;

        const recentTransactions = expense.slice(0, 5);  // get the last 5 transactions
        res.json({
            success : true,
            data : {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({
            success : false,
            message : "Error fetching expense overview",
            error : err.message
        });
    }
}