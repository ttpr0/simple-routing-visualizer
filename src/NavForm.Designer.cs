
namespace RoutingVisualizer
{
    partial class NavForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.txtout = new System.Windows.Forms.TextBox();
            this.btnRunShortestPath = new System.Windows.Forms.Button();
            this.pbxout = new System.Windows.Forms.PictureBox();
            this.ctmpbx = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.setStartNodeToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.setEndNodeToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.txtstart = new System.Windows.Forms.TextBox();
            this.txtend = new System.Windows.Forms.TextBox();
            this.lblstartid = new System.Windows.Forms.Label();
            this.lblendid = new System.Windows.Forms.Label();
            this.cbxShortestPath = new System.Windows.Forms.ComboBox();
            this.lblalgtype = new System.Windows.Forms.Label();
            this.chbxDraw = new System.Windows.Forms.CheckBox();
            this.timerDrawPbx = new System.Windows.Forms.Timer(this.components);
            this.btnRunMultiGraph = new System.Windows.Forms.Button();
            this.btnRunTrafficSim = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.pbxout)).BeginInit();
            this.ctmpbx.SuspendLayout();
            this.SuspendLayout();
            // 
            // txtout
            // 
            this.txtout.Location = new System.Drawing.Point(12, 12);
            this.txtout.Multiline = true;
            this.txtout.Name = "txtout";
            this.txtout.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtout.Size = new System.Drawing.Size(226, 600);
            this.txtout.TabIndex = 0;
            // 
            // btnRunShortestPath
            // 
            this.btnRunShortestPath.Location = new System.Drawing.Point(685, 626);
            this.btnRunShortestPath.Name = "btnRunShortestPath";
            this.btnRunShortestPath.Size = new System.Drawing.Size(90, 23);
            this.btnRunShortestPath.TabIndex = 2;
            this.btnRunShortestPath.Text = "Run";
            this.btnRunShortestPath.UseVisualStyleBackColor = true;
            this.btnRunShortestPath.Click += new System.EventHandler(this.btnRunShortestPath_Click);
            // 
            // pbxout
            // 
            this.pbxout.Location = new System.Drawing.Point(244, 12);
            this.pbxout.Name = "pbxout";
            this.pbxout.Size = new System.Drawing.Size(1000, 600);
            this.pbxout.TabIndex = 3;
            this.pbxout.TabStop = false;
            this.pbxout.MouseClick += new System.Windows.Forms.MouseEventHandler(this.pbxout_MouseClick);
            this.pbxout.MouseDown += new System.Windows.Forms.MouseEventHandler(this.pbxout_MouseDown);
            this.pbxout.MouseMove += new System.Windows.Forms.MouseEventHandler(this.pbxout_MouseMove);
            this.pbxout.MouseUp += new System.Windows.Forms.MouseEventHandler(this.pbxout_MouseUp);
            this.pbxout.MouseWheel += new System.Windows.Forms.MouseEventHandler(this.pbxout_MouseWheel);
            // 
            // ctmpbx
            // 
            this.ctmpbx.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.setStartNodeToolStripMenuItem,
            this.setEndNodeToolStripMenuItem});
            this.ctmpbx.Name = "ctmpbx";
            this.ctmpbx.Size = new System.Drawing.Size(151, 48);
            // 
            // setStartNodeToolStripMenuItem
            // 
            this.setStartNodeToolStripMenuItem.Name = "setStartNodeToolStripMenuItem";
            this.setStartNodeToolStripMenuItem.Size = new System.Drawing.Size(150, 22);
            this.setStartNodeToolStripMenuItem.Text = "set Start-Node";
            this.setStartNodeToolStripMenuItem.Click += new System.EventHandler(this.setStartNodeToolStripMenuItem_Click);
            // 
            // setEndNodeToolStripMenuItem
            // 
            this.setEndNodeToolStripMenuItem.Name = "setEndNodeToolStripMenuItem";
            this.setEndNodeToolStripMenuItem.Size = new System.Drawing.Size(150, 22);
            this.setEndNodeToolStripMenuItem.Text = "set End-Node";
            this.setEndNodeToolStripMenuItem.Click += new System.EventHandler(this.setEndNodeToolStripMenuItem_Click);
            // 
            // txtstart
            // 
            this.txtstart.Location = new System.Drawing.Point(101, 626);
            this.txtstart.Name = "txtstart";
            this.txtstart.Size = new System.Drawing.Size(100, 23);
            this.txtstart.TabIndex = 4;
            // 
            // txtend
            // 
            this.txtend.Location = new System.Drawing.Point(309, 626);
            this.txtend.Name = "txtend";
            this.txtend.Size = new System.Drawing.Size(100, 23);
            this.txtend.TabIndex = 5;
            // 
            // lblstartid
            // 
            this.lblstartid.AutoSize = true;
            this.lblstartid.Location = new System.Drawing.Point(12, 630);
            this.lblstartid.Name = "lblstartid";
            this.lblstartid.Size = new System.Drawing.Size(82, 15);
            this.lblstartid.TabIndex = 6;
            this.lblstartid.Text = "Start-Node ID:";
            // 
            // lblendid
            // 
            this.lblendid.AutoSize = true;
            this.lblendid.Location = new System.Drawing.Point(225, 630);
            this.lblendid.Name = "lblendid";
            this.lblendid.Size = new System.Drawing.Size(78, 15);
            this.lblendid.TabIndex = 7;
            this.lblendid.Text = "End-Node ID:";
            // 
            // cbxShortestPath
            // 
            this.cbxShortestPath.FormattingEnabled = true;
            this.cbxShortestPath.Items.AddRange(new object[] {
            "Djkstra",
            "A*",
            "Bidirect-Djkstra",
            "Bidirect-A*"});
            this.cbxShortestPath.Location = new System.Drawing.Point(545, 625);
            this.cbxShortestPath.Name = "cbxShortestPath";
            this.cbxShortestPath.Size = new System.Drawing.Size(121, 23);
            this.cbxShortestPath.TabIndex = 10;
            // 
            // lblalgtype
            // 
            this.lblalgtype.AutoSize = true;
            this.lblalgtype.Location = new System.Drawing.Point(444, 629);
            this.lblalgtype.Name = "lblalgtype";
            this.lblalgtype.Size = new System.Drawing.Size(95, 15);
            this.lblalgtype.TabIndex = 11;
            this.lblalgtype.Text = "select algorithm:";
            // 
            // chbxDraw
            // 
            this.chbxDraw.AutoSize = true;
            this.chbxDraw.Location = new System.Drawing.Point(798, 629);
            this.chbxDraw.Name = "chbxDraw";
            this.chbxDraw.Size = new System.Drawing.Size(125, 19);
            this.chbxDraw.TabIndex = 12;
            this.chbxDraw.Text = "Draw Path-Search?";
            this.chbxDraw.UseVisualStyleBackColor = true;
            // 
            // timerDrawPbx
            // 
            this.timerDrawPbx.Enabled = true;
            this.timerDrawPbx.Interval = 30;
            this.timerDrawPbx.Tick += new System.EventHandler(this.timerDrawPbx_Tick);
            // 
            // btnRunMultiGraph
            // 
            this.btnRunMultiGraph.Location = new System.Drawing.Point(1011, 625);
            this.btnRunMultiGraph.Name = "btnRunMultiGraph";
            this.btnRunMultiGraph.Size = new System.Drawing.Size(75, 23);
            this.btnRunMultiGraph.TabIndex = 13;
            this.btnRunMultiGraph.Text = "MultiGraph";
            this.btnRunMultiGraph.UseVisualStyleBackColor = true;
            this.btnRunMultiGraph.Click += new System.EventHandler(this.btnRunMultiGraph_Click);
            // 
            // btnRunTrafficSim
            // 
            this.btnRunTrafficSim.Location = new System.Drawing.Point(1123, 625);
            this.btnRunTrafficSim.Name = "btnRunTrafficSim";
            this.btnRunTrafficSim.Size = new System.Drawing.Size(75, 23);
            this.btnRunTrafficSim.TabIndex = 14;
            this.btnRunTrafficSim.Text = "Traffic Sim";
            this.btnRunTrafficSim.UseVisualStyleBackColor = true;
            this.btnRunTrafficSim.Click += new System.EventHandler(this.btnRunTrafficSim_Click);
            // 
            // NavForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1256, 660);
            this.Controls.Add(this.btnRunTrafficSim);
            this.Controls.Add(this.btnRunMultiGraph);
            this.Controls.Add(this.chbxDraw);
            this.Controls.Add(this.lblalgtype);
            this.Controls.Add(this.cbxShortestPath);
            this.Controls.Add(this.lblendid);
            this.Controls.Add(this.lblstartid);
            this.Controls.Add(this.txtend);
            this.Controls.Add(this.txtstart);
            this.Controls.Add(this.pbxout);
            this.Controls.Add(this.btnRunShortestPath);
            this.Controls.Add(this.txtout);
            this.Name = "NavForm";
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pbxout)).EndInit();
            this.ctmpbx.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox txtout;
        private System.Windows.Forms.Button btnRunShortestPath;
        private System.Windows.Forms.PictureBox pbxout;
        private System.Windows.Forms.TextBox txtstart;
        private System.Windows.Forms.TextBox txtend;
        private System.Windows.Forms.Label lblstartid;
        private System.Windows.Forms.Label lblendid;
        private System.Windows.Forms.ContextMenuStrip ctmpbx;
        private System.Windows.Forms.ToolStripMenuItem setStartNodeToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem setEndNodeToolStripMenuItem;
        private System.Windows.Forms.ComboBox cbxShortestPath;
        private System.Windows.Forms.Label lblalgtype;
        private System.Windows.Forms.CheckBox chbxDraw;

        private System.Windows.Forms.Timer timerDrawPbx;
        private System.Windows.Forms.Button btnRunMultiGraph;
        private System.Windows.Forms.Button btnRunTrafficSim;
    }
}

