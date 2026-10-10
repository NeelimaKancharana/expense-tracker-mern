import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";
// add income
export const addIncome = async (req, res) => {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

  try {
      if(!description || !amount || !category || !date)
      {
        return res.json({
            success : false,
            message : "All fields are required"
        });
      }

      const newIncome = new incomeModel({
        userId,
        description,
        amount,
        category,
        date : new Date(date)
        
      });

      await newIncome.save();

      res.json({
        success : true,
        message : "Income added successfully",
        income : newIncome
      });
  } 
  
  catch (error) {
    console.log(error);
    res.status(500).json({
      success : false,
      message : "Error adding income",
      error : error.message
    });
  }
}

// to get all income of a particular user
export const getIncome = async (req,res) => {
    const userId = req.user._id;

    try{
        const incomes = await incomeModel.find({userId}).sort({date : -1});  // latest income will be shown first, so we are sorting the data in descending order of date
        res.json({
            success : true,
            incomes
        });
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({
            success : false,
            message : "Error fetching income",
            error : err.message
        });
    }
}

// updatea income
export const updateIncome = async (req,res) => {
    const userId = req.user._id;
    const { id } = req.params;
    const { description, amount } = req.body;

    try{
        const updatedIncome = await incomeModel.findOneAndUpdate(
            { _id: id, userId },
            { description, amount },
            { new: true }
        );

        if(!updatedIncome)
        {
            return res.status(404).json({
                success : false,
                message : "Income not found"
            });
        }

        res.json({
            success : true,
            message : "Income updated successfully",
            data: updatedIncome
        });
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({
            success : false,
            message : "Error updating income",
            error : err.message
        });
    }
}

// delete income
export const deleteIncome = async (req,res) => {
    

    try{
        const income = await incomeModel.findByIdAndDelete({ _id: req.params.id });

        if(!income)
        {
            return res.status(404).json({
                success : false,
                message : "Income not found"
            });
        }

        // await income.remove();

        res.json({
            success : true,
            message : "Income deleted successfully"
        });
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({
            success : false,
            message : "Error deleting income",
            error : err.message
        });
    }
}

// to download the excel sheet of income data of a particular user
export const downloadIncomeExcel = async (req,res) => {
    const userId = req.user._id;
    
    try{
        const income = await incomeModel.find({userId}).sort({date : -1});  // latest income will be shown first, so we are sorting the data in descending order of date
        const plainData = income.map((inc) => ({
            description : inc.description,
            amount : inc.amount,
            category : inc.category,
            date : new Date(inc.date).toLocaleDateString(),  // to get the date in yyyy-mm-dd format
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "IncomeModell");
        XLSX.writeFile(workbook, "Income_Detail.xlsx");
        res.download("Income_Detail.xlsx");
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({
            success : false,
            message : "Error downloading income data",
            error : err.message
        });
    }
}

// to get the income overview of a particular user for a particular time period
export const getIncomeOverview = async (req,res) => {
    try{
        const userId = req.user._id;
        const { range = "monthly"} = req.query;  // default range is monthly
        const { start, end } = getDateRange(range);
        const income = await incomeModel.find({
            userId,
            date : {
                $gte : start,
                $lte : end
            }

        }).sort({date : -1});  // latest income will be shown first, so we are sorting the data in descending order of date

        const totalIncome = income.reduce((acc, item) => acc + item.amount, 0);
        const averageIncome = income.length > 0 ? totalIncome / income.length : 0;
        const numberOfTransactions = income.length;

        const recentTransactions = income.slice(0, 9);  // get the last 9 transactions
        res.json({
            success : true,
            data : {
                totalIncome,
                averageIncome,
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
            message : "Error fetching income overview",
            error : err.message
        });
    }
}
   