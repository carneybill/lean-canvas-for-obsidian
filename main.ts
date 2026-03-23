import { Plugin, TFile, Notice } from 'obsidian';

export default class LeanCanvasPlugin extends Plugin {
  declare app: any;
  declare addCommand: any;
  async onload() {
    this.addCommand({
      id: 'generate-canvas-ratings',
      name: 'Generate Canvas Ratings and Save',
      callback: () => this.generateRatingsAndSave(),
    });

    this.addCommand({
      id: 'export-canvas-to-pdf',
      name: 'Export Canvas to PDF',
      callback: () => this.exportCanvasToPDF(),
    });
  }

  async generateRatingsAndSave() {
    const files = this.app.vault.getMarkdownFiles();
    for (const file of files) {
      if (file.name.includes('💎') || file.name.includes('❗️') || file.name.includes('💡') || file.name.includes('✨') || file.name.includes('🎯') || file.name.includes('🤗') || file.name.includes('🗝️') || file.name.includes('💰') || file.name.includes('💸')) {
        const content = await this.app.vault.read(file);
        const rating = this.evaluateCanvas(content);
        const updated = `# Rating: ${rating}/100\n\n${content}`;
        // Create a backup before modifying the file
        const backupPath = `${file.path}.bak`;
        try {
          await (this.app as any).vault.adapter.copy(file.path, backupPath);
          await (this.app as any).vault.modify(file, updated);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          new Notice(`Failed to update ${file.name}: ${message}`);
        }
      }
    }
    new Notice('Canvas ratings generated and saved.');
  }

  evaluateCanvas(content: string): number {
    const sections = ['Problem', 'Solution', 'Value', 'Advantage', 'Channels', 'Customers', 'Metrics', 'Cost', 'Revenue'];
    let score = 0;
    for (const section of sections) {
      if (content.toLowerCase().includes(section.toLowerCase())) {
        score += 10;
      }
    }
    const lengthScore = Math.min(20, Math.floor(content.length / 200));
    return Math.min(100, score + lengthScore);
  }

  async exportCanvasToPDF() {
    const files = this.app.vault.getMarkdownFiles();
    for (const file of files) {
      if (file.name.includes('💎') || file.name.includes('❗️') || file.name.includes('💡') || file.name.includes('✨') || file.name.includes('🎯') || file.name.includes('🤗') || file.name.includes('🗝️') || file.name.includes('💰') || file.name.includes('💸')) {
        const content = await this.app.vault.read(file);
        const pdfPath = file.path.replace('.md', '.pdf');
        try {
          // Use a simple text-to-PDF conversion placeholder (replace with pdf-lib or jsPDF for production)
          const encoder = new TextEncoder();
          const pdfHeader = '%PDF-1.4\n';
          const pdfContent = `${pdfHeader}${content}\n%%EOF`;
          const arrayBuffer = encoder.encode(pdfContent);
          await (this.app as any).vault.adapter.writeBinary(pdfPath, arrayBuffer);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          new Notice(`Failed to export ${file.name} to PDF: ${message}`);
        }
      }
    }
    new Notice('Canvas files exported to PDF.');
  }
}
