import { Request, Response } from 'express';
import { getAgencyReport, getCertificateReport } from "../models/report";
import Agency from '../models/agency';
import { User } from '../models/user';

function getReportString (reportContent: any[]): string {
    if (reportContent.length === 0) return "";
    const reportRows = [Object.keys(reportContent[0]).join(",")]; // column names

    reportContent.forEach((row) => {
        return reportRows.push(Object.values(row).join(","));
    })
    return reportRows.join("\n");
}

export const getReport = async (req: Request, res: Response) => {
    try {
        const jwtToken = req.body.jwtToken;
        User.verifyJWTToken(jwtToken)
    } catch (error: any) {
        res.status(500).json({message: "Unauthorized Access", data: {}, jwtAuthError: true })
    }
    try {
        
        const allAgencies: {id: string, name:string}[] = (await Agency.getAll())
            .docs.map(doc => {
                return {
                    id: doc.id,
                    name: doc.data().name
                }
            });
        if (req.body.reportType === "by-agency") {
            const reportContent: any[] = await getAgencyReport(
                JSON.parse(req.body.agencies) as string[], 
                req.body.startDate, 
                req.body.endDate,
                allAgencies
            );
            res.status(200).json({
                report: getReportString(reportContent), 
                message: "Report generated successfully"
            });
            return;
        } else if (req.body.reportType === "by-certificate") {
            const reportContent = await getCertificateReport(
                JSON.parse(req.body.agencies) as string[],
                req.body.startDate,
                req.body.endDate,
                allAgencies
            );
            res.status(200).json({
                report: getReportString(reportContent), 
                message: "Report generated successfully"
            });
            return;
        } else {
            res.status(400).json({ message: `Invalid report type:${JSON.stringify(req.body.reportType)}` });
            return;
        }
    } catch (error: any){
        res.status(500).json({ message: error.message });
        return;
    }
}
