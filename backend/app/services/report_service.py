from fpdf import FPDF
import pandas as pd
from datetime import datetime
import matplotlib.pyplot as plt
import io
import tempfile
import os

def generate_pie_chart(prediction_distribution: dict) -> bytes:
    """
    Generates a pie chart from prediction distribution and returns it as bytes.
    """
    labels = prediction_distribution.keys()
    sizes = prediction_distribution.values()
    
    fig, ax = plt.subplots()
    ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90)
    ax.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    return buf.getvalue()

def generate_histogram(data: pd.Series, title: str) -> bytes:
    """
    Generates a histogram for a given data series and returns it as bytes.
    """
    fig, ax = plt.subplots()
    ax.hist(data, bins=20, edgecolor='black')
    ax.set_title(title)
    ax.set_xlabel('Probability')
    ax.set_ylabel('Frequency')
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    return buf.getvalue()

class PDFReport(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Prediction Report', 0, 1, 'C')
        self.set_font('Arial', '', 8)
        self.cell(0, 10, f'Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def add_summary(self, model_name: str, file_name: str, total_records: int, prediction_distribution: dict):
        self.set_font('Arial', 'B', 10)
        self.cell(0, 10, 'Prediction Summary', 0, 1, 'L')
        
        self.set_font('Arial', '', 10)
        self.cell(0, 10, f'Model Used: {model_name}', 0, 1, 'L')
        self.cell(0, 10, f'Input File: {file_name}', 0, 1, 'L')
        self.cell(0, 10, f'Total Records: {total_records}', 0, 1, 'L')
        
        self.set_font('Arial', 'B', 10)
        self.cell(0, 10, 'Prediction Distribution:', 0, 1, 'L')
        self.set_font('Arial', '', 10)
        
        summary_text = ""
        for category, count in prediction_distribution.items():
            self.cell(0, 10, f'  - {category}: {count}', 0, 1, 'L')
            if total_records > 0:
                percentage = (count / total_records) * 100
                summary_text += f"{percentage:.1f}% of records are predicted as '{category}'. "

        self.ln(5)
        self.set_font('Arial', 'I', 10)
        self.multi_cell(0, 5, f"Based on the analysis of {total_records} records, {summary_text}This distribution is visualized in the chart below. Further analysis of customer attributes can help identify the key drivers of churn.")
        self.ln(10)

    def add_chart(self, image_bytes: bytes, title: str):
        tmp_filename = ""
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
                tmp.write(image_bytes)
                tmp_filename = tmp.name
            
            self.set_font('Arial', 'B', 10)
            self.cell(0, 10, title, 0, 1, 'L')
            self.image(tmp_filename, w=150)
            self.ln(10)
        finally:
            if tmp_filename and os.path.exists(tmp_filename):
                os.unlink(tmp_filename)

    def add_data_table(self, df: pd.DataFrame, num_rows: int = 10):
        self.set_font('Arial', 'B', 10)
        self.cell(0, 10, f'Sample of Prediction Data (first {num_rows} rows)', 0, 1, 'L')
        
        self.set_font('Arial', '', 8)
        
        # Table Header
        self.set_fill_color(200, 220, 255)
        
        # Calculate dynamic column widths
        col_widths = [self.w / (len(df.columns) + 1)] * len(df.columns)
        
        for i, col in enumerate(df.columns):
            self.cell(col_widths[i], 10, col, 1, 0, 'C', 1)
        self.ln()

        # Table Rows
        for i in range(min(num_rows, len(df))):
            for j, col in enumerate(df.columns):
                self.cell(col_widths[j], 10, str(df.iloc[i][col]), 1, 0, 'C')
            self.ln()

def generate_report(data: dict) -> bytes:
    """
    Generates a PDF report from prediction data.
    """
    df = pd.DataFrame(data['records'])
    model_name = data.get('model_used', 'N/A')
    file_name = data.get('file_name', 'N/A')
    prediction_col = data.get('prediction_column', 'Predicted_Target')
    
    total_records = len(df)
    prediction_distribution = df[prediction_col].value_counts().to_dict()

    # Generate pie chart
    pie_chart_bytes = generate_pie_chart(prediction_distribution)

    pdf = PDFReport()
    pdf.add_page()
    pdf.add_summary(model_name, file_name, total_records, prediction_distribution)
    pdf.add_chart(pie_chart_bytes, 'Prediction Distribution Chart')

    # Generate histogram for churn probability if available
    if 'churn_probability' in df.columns:
        hist_bytes = generate_histogram(df['churn_probability'], 'Churn Probability Distribution')
        pdf.add_chart(hist_bytes, 'Churn Probability Distribution')

    pdf.add_data_table(df.head(10))
    
    return pdf.output(dest='S').encode('latin-1')