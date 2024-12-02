import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { certificate } from "../../interfaces";
export const createAndDownloadCertificate = async (certificate: certificate) => {
    // TODO: use an evn variable to pass in frontend url for fetching gift cerificate
    const fileData = await fetch(`/gift_certificate.pdf`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/pdf',
        },
    })
        .then((response) => response.arrayBuffer());
    const pdfDoc = await PDFDocument.load(fileData);
    const arialFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    // The following embeddings are the result of trial and error, which requires updates if gift certificate template changes
    // Embed the agency name on the certificate
    firstPage.drawText(`${certificate.agency?.name}`, {
        x: 90,
        y: 582,
        size: 12,
        font: arialFont,
        color: rgb(0, 0, 0),
    });
    // Embed the certificate id on the certificate
    firstPage.drawText(`${certificate.id}`, {
        x: 320,
        y: 555,
        size: 12,
        font: arialFont,
        color: rgb(0, 0, 0),
    });
    // Embed the certificate amount on the certificate
    firstPage.drawText(`${certificate.amount}`, {
        x: 50,
        y: 660,
        size: 12,
        font: arialFont,
        color: rgb(0, 0, 0),
    });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    const clickHandler = () => {
        setTimeout(() => {
          URL.revokeObjectURL(url);
          a.removeEventListener('click', clickHandler);
        }, 150);
    };
    
    a.addEventListener('click', clickHandler, false);

    a.href = url;
    a.download = `gift_certificate_${certificate.id}.pdf`;
    a.click();
}

export const downloadCertificates = async (certificates: certificate[]) => {
    const allCertificates = await PDFDocument.create();
    const fileData = await fetch(`/gift_certificate.pdf`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/pdf',
        },
    })
        .then((response) => response.arrayBuffer());
    
    for (const certificate of certificates){
        const pdfDoc = await PDFDocument.load(fileData);
        const arialFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        // The following embeddings are the result of trial and error, which requires updates if gift certificate template changes
        // Embed the agency name on the certificate
        firstPage.drawText(`${certificate.agency?.name}`, {
            x: 90,
            y: 582,
            size: 12,
            font: arialFont,
            color: rgb(0, 0, 0),
        });
        // Embed the certificate id on the certificate
        firstPage.drawText(`${certificate.id}`, {
            x: 320,
            y: 555,
            size: 12,
            font: arialFont,
            color: rgb(0, 0, 0),
        });
        // Embed the certificate amount on the certificate
        firstPage.drawText(`${certificate.amount}`, {
            x: 50,
            y: 660,
            size: 12,
            font: arialFont,
            color: rgb(0, 0, 0),
        });
        const [copiedPage] = await allCertificates.copyPages(pdfDoc, [0]);
        allCertificates.addPage(copiedPage);
    };

    const pdfBytes = await allCertificates.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const clickHandler = () => {
        setTimeout(() => {
          URL.revokeObjectURL(url);
          a.removeEventListener('click', clickHandler);
        }, 150);
    };
    
    a.addEventListener('click', clickHandler, false);

    a.href = url;
    a.download = `gift_certificates.pdf`;
    a.click();
}
