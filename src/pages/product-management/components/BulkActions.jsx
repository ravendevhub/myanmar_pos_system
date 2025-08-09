import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ 
  selectedProducts, 
  onBulkDelete, 
  onBulkExport, 
  onGenerateBarcodes,
  onImportExcel,
  onClearSelection 
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleBulkDelete = () => {
    if (selectedProducts?.length === 0) return;
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    onBulkDelete(selectedProducts);
    setShowConfirmDelete(false);
  };

  const handleFileImport = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      onImportExcel(file);
    }
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Product Management</h3>
          {selectedProducts?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedProducts?.length} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                iconName="X"
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Import Excel */}
          <div className="relative">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="excel-import"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Upload"
              className="cursor-pointer"
            >
              Import Excel
            </Button>
          </div>

          {/* Export Selected/All */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkExport(selectedProducts)}
            iconName="Download"
          >
            Export {selectedProducts?.length > 0 ? 'Selected' : 'All'}
          </Button>

          {/* Generate Barcodes */}
          {selectedProducts?.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerateBarcodes(selectedProducts)}
              iconName="QrCode"
            >
              Generate Barcodes
            </Button>
          )}

          {/* Bulk Delete */}
          {selectedProducts?.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              iconName="Trash2"
            >
              Delete Selected
            </Button>
          )}
        </div>
      </div>
      {/* Bulk Actions Info */}
      {selectedProducts?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Info" size={14} />
              <span>Bulk actions available for {selectedProducts?.length} products</span>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Confirm Deletion</h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <p className="text-foreground mb-6">
              Are you sure you want to delete {selectedProducts?.length} selected products? 
              This will permanently remove them from your inventory.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete Products
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActions;