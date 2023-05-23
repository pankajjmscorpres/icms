// Models Import
const Branch = require("../models/branch");
const Section = require("../models/section");
const { response } = require("../routes");
require("dotenv").config({ path: "./config/dev.env" });

// Branch Controller
// ==========================================================================================

// 0. Test Branch
const testBranch = (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Branch APIs working properly'
    })
}

// 1.Get Details of a Particular Branch
const getBranchDetails = async (req, res) => {
    try {
        const branchName = req.query.branchName;
        console.log('param', branchName)
        if (!branchName) {
            res.status(400)
            throw new Error('Branch Name is missing');

        }
        const branchData = await Branch.find({ name: branchName }).populate({
            path: 'teachers',
            select: ['-password']
        })
            .populate({
                path: 'hodRef',
                select: ['-password']
            }).populate({
                path: 'issues.issueSubmittedByStudent',
                select: ['-password'],
            })
        if (!branchData) {
            res.status(400)
            throw new Error('Some Error Occured,Pls Try Again');
        }
        res.status(200).json({
            success: true,
            data: {
                branchData: branchData,
            },
            msg: 'Branch Data successfully fetched'
        })
    }
    catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val) => val.message);
            res.status(400).json({
                success: false,
                error: messages,
            });
        } else {
            console.log(`Error occured ${err}`);
            return res.status(500).json({
                success: false,
                error: `${err}`,
            });
        }
    }
}

// 2.Get List of Sections of a Particular Branch
const getListOfSections = async (req, res) => {
    try {
        const { branchName, year } = req.body;
        if (!branchName) {
            throw new Error('Branch Name missing');
        }
        const query = {};
        if (branchName && year) {
            query.sectionBranchName = branchName;
            query.sectionYear = year;
        }
        else {
            query.sectionBranchName = branchName
        }
        const sectionListData = await Section.find({ query });
        if (!sectionListData) {
            throw new Error('Some Error Occured')
        }
        const response = {};
        if (!year) {
            response.data.firstYearList = sectionListData.filter(item => item.sectionYear === '1');
            response.data.secondYearList = sectionListData.filter(item => item.sectionYear === '2');
            response.data.thirdYearList = sectionListData.filter(item => item.sectionYear === '3');
            response.data.fourthYearList = sectionListData.filter(item => item.sectionYear === '4');
            response.msg = 'Section List Fetched Successfully';
            response.success = true;
        }
        else {
            response.data = sectionListData,
                response.msg = 'Section List Fetched Successfully';
            response.success = true;
        }
        res.status(200).json(...response)
    }
    catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val) => val.message);
            res.status(400).json({
                success: false,
                error: messages,
            });
        } else {
            console.log(`Error occured ${err}`);
            return res.status(500).json({
                success: false,
                error: `${err}`,
            });
        }
    }
}


// 3. Resolve Issues
const resolveIssue = async (req, res) => {
    try {
        const hodId = req.params.id; // teachers id who is hod
        const { issueId, title, status } = req.body;
        if (!issueId || !hodId) {
            throw new Error('Some Fields are missing')
        }
        const branchData = await Branch.findOne({ hodRef: hodId })
        if (!branchData) {
            throw new Error('Branch Data not found')
        }
        const branchDataIssues = branchData?.issues;
        const updatedBranchDataIssues = branchDataIssues?.map(item => {
            if (String(item._id) === String(issueId) && !item?.isAttended) {
                item.status = status;
                item.isAttended = true;
                if (title) item.title = title;
            }
            return item;
        })
        if (branchData?.issues)
            branchData.issues = updatedBranchDataIssues;
        // updated branch data
        const updatedBranchData = await branchData.save();
        if (!updatedBranchData) {
            throw new Error('Branch Data not updated')
        }
        res.status(200).json({
            success: true,
            msg: 'Issue Updated Successfully',
            data: updatedBranchData,
        })
    }
    catch (err) {
        console.log(`Error occured ${err}`);
        return res.status(500).json({
            success: false,
            error: `${err}`,
        });
    }
}

module.exports = { testBranch, getBranchDetails, getListOfSections, resolveIssue }


// Branch Creation First Phase
// Assign HOD Second Phase
// Teachers account can be created only if their branch exists in our database
