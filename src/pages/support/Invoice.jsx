import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoiceData } from '../../features/commerceSlice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import DynamicInvoiceTable from './DynamicInvoiceTable';

const Invoice = () => {
  const { invoiceData } = useSelector((state) => state.commerce);
  const token = localStorage.getItem("key");
  const numberIn = localStorage.getItem("inum");
  const linkItem = localStorage.getItem("liurl");
  const dispatch = useDispatch();
  const invoiceRef = useRef();

  useEffect(() => {
    if (token && numberIn) {
      dispatch(getInvoiceData({ token, invoice_id: numberIn }));
    }
  }, [dispatch, token, numberIn]);

//   const tableHeaders = ['Description', 'Quantity', 'Unit Price', 'Total'];
const tableHeaders = ['Product Name', 'Inches', 'Quantity', 'Price', 'Discounted Price', 'Total'];

  const logoUrl = 'logo2.png';

  const totalAmount = invoiceData?.products?.reduce(
    (sum, item) => sum + item.order_quantity * item.product_amount,
    0
  );


  const generatePDF = async () => {
    // Create a clone of the invoice div to modify for PDF
    const invoiceClone = invoiceRef.current.cloneNode(true);

    localStorage.removeItem('landmark_price');

    
    // Remove the buttons from the clone
    const buttons = invoiceClone.querySelectorAll('button, .btn');
    buttons.forEach(button => button.remove());
    
    // Add payment link to clone
    const paymentDiv = document.createElement('div');
    // paymentDiv.innerHTML = `
    //   <div style="margin-top: 20px; color: #0066cc;">
    //     <p>Click here to pay: ${linkItem}</p>
    //   </div>
    // `;
    invoiceClone.appendChild(paymentDiv);

    // Temporarily append clone to document
    document.body.appendChild(invoiceClone);

    try {
      // Convert to canvas
      const canvas = await html2canvas(invoiceClone, {
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true, // Allow loading cross-origin images
        allowTaint: true
      });

      // Remove clone
      document.body.removeChild(invoiceClone);

      // PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pixelRatio = canvas.width / canvas.height;
      const imgHeight = imgWidth / pixelRatio;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add canvas as image
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Add clickable payment link
      pdf.setTextColor(0, 102, 204); // Blue color
      pdf.setFontSize(12);

    
      const linkY = imgHeight + 10;
      pdf.textWithLink('Click here to pay invoice', 14, linkY, {
        url: linkItem
      });

      // Save the PDF
      pdf.save(`invoice-${numberIn}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to basic PDF generation if html2canvas fails
      generateBasicPDF();
    }
  };

  const generateBasicPDF = () => {
    const pdf = new jsPDF();
    
    // Set up fonts and styles
    pdf.setFont('helvetica');
    pdf.setFontSize(20);
    
    // Add logo
    pdf.addImage(logoUrl, 'PNG', 170, 10, 30, 10);
    
    // Add header
    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Invoice', 14, 20);
    
    // Add invoice details
    pdf.setFontSize(12);
    pdf.text(`Invoice ID: ${numberIn}`, 14, 35);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 14, 42);
    
    // Add customer details
    pdf.text('Billed To:', 14, 55);
    pdf.setFontSize(11);
    pdf.text(invoiceData.customer_name, 14, 62);
    pdf.text(invoiceData.delivery_address || '', 14, 69);
    pdf.text(`Email: ${invoiceData.customer_email}`, 14, 76);
    
    // Add table
    pdf.autoTable({
      head: [tableHeaders],
      body: invoiceData.products.map(item => [
        item.product_name,
        item.order_quantity,
        `₦${item.product_amount.toLocaleString()}`,
        `₦${(item.order_quantity * item.product_amount).toLocaleString()}`
      ]),
      startY: 85,
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [51, 51, 51]
      }
    });
    
    // Add total
    const finalY = pdf.autoTable.previous.finalY + 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Total: ₦${totalAmount.toLocaleString()}`, 14, finalY);
    
    // Add payment link
    pdf.setTextColor(0, 102, 204);
    pdf.textWithLink('Click here to pay invoice', 14, finalY + 10, {
      url: linkItem
    });
    
    pdf.save(`invoice-${numberIn}.pdf`);
  };

  return (
    <div className='p-5' ref={invoiceRef}>
      <div className="d-flex justify-content-between py-5 px-3">
          <div>
             <img src={logoUrl} alt="Company Logo" className="w-50" />
          </div>
          <div>
            <p>Invoice ID: <strong>{numberIn}</strong></p>
            <p>Date: <strong>{new Date().toLocaleDateString()}</strong></p>
          </div>
      </div>
      <div className="invoice-details py-5 px-3">
        <p><strong>Billed To:</strong></p>
        <p>{invoiceData.customer_name}</p>
        <p>{invoiceData.delivery_address}</p>
        <p>Email: {invoiceData.customer_email}</p>
      </div>
      <DynamicInvoiceTable data={invoiceData}/>
      <button onClick={generatePDF} className="pro-btn">Download Invoice</button>
      <a href={linkItem} className="btn pay-btn" target="_blank" rel="noopener noreferrer">
        Pay Invoice
      </a>
    </div>
  );
};

export default Invoice;
