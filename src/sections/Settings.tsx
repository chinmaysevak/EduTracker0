// ============================================
// Settings Section - Import/Export Functionality
// ============================================

import { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useImportExport } from '@/hooks/useImportExport';

export default function Settings() {
  const { exportData, importData, clearAllData } = useImportExport();
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportData();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert('Please select a valid JSON file');
      return;
    }

    setIsImporting(true);
    try {
      const success = await importData(file);
      if (success) {
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setIsClearing(true);
      try {
        clearAllData();
      } finally {
        setIsClearing(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your data with import and export functionality
        </p>
      </div>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
          <CardDescription>
            Download all your EduTracker data as a JSON file for backup or sharing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                The exported file contains all your subjects, attendance records, study materials, 
                playlists, tasks, progress tracking, notifications, and timetable settings.
              </AlertDescription>
            </Alert>
            <Button onClick={handleExport} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
          <CardDescription>
            Restore your data from a previously exported JSON file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> Importing data will replace all existing data. 
                Consider exporting your current data first as a backup.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="import-file">Select JSON File</Label>
              <Input
                ref={fileInputRef}
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
              />
            </div>
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? 'Importing...' : 'Import Data'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clear Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Clear All Data
          </CardTitle>
          <CardDescription>
            Permanently delete all your EduTracker data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>Danger Zone:</strong> This action cannot be undone. 
                All your data will be permanently deleted.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handleClearData}
              disabled={isClearing}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isClearing ? 'Clearing...' : 'Clear All Data'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            About Import/Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Export:</strong> Creates a complete backup of all your data in JSON format. 
              This file can be used to restore your data on this device or import it to another device.
            </p>
            <p>
              <strong>Import:</strong> Restores data from a previously exported file. 
              This will replace all existing data in the application.
            </p>
            <p>
              <strong>File Format:</strong> Only JSON files exported from EduTracker can be imported. 
              The file includes version information to ensure compatibility.
            </p>
            <p>
              <strong>Data Privacy:</strong> All data is stored locally in your browser. 
              No data is sent to external servers during export or import operations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
