'use client';

import React, { useState } from 'react';
import { Supplier, RFQ } from '../types';
import {
  X,
  FileText,
  UploadCloud,
  Send,
  CheckCircle2,
  Building2,
  Calendar,
  Clock,
  AlertCircle,
  FileCode2,
  Trash2
} from 'lucide-react';
import { POPULAR_MATERIALS, CERTIFICATIONS_LIST } from '../data/defaultCategories';

interface RfqModalProps {
  supplier: Supplier | null;
  onClose: () => void;
  onSubmit: (
    rfqData: Omit<RFQ, 'id' | 'createdAt' | 'status'>
  ) => void | Promise<any>;
}

export function RfqModal({ supplier, onClose, onSubmit }: RfqModalProps) {
  const [title, setTitle] = useState('');
  const [material, setMaterial] = useState(
    supplier?.materials[0] || 'Aluminum 6061-T6'
  );
  const [quantity, setQuantity] = useState(100);
  const [targetDeliveryDays, setTargetDeliveryDays] = useState(14);
  const [targetUnitBudget, setTargetUnitBudget] =
    useState<number | undefined>(undefined);
  const [specifications, setSpecifications] = useState('');
  const [selectedCerts, setSelectedCerts] =
    useState<string[]>(['ISO 9001:2015']);

  const [attachments, setAttachments] = useState<
    {
      name: string;
      sizeKb: number;
      type: string;
    }[]
  >([
    {
      name: 'Part_Specification_Drawing_v1.pdf',
      sizeKb: 1450,
      type: 'PDF',
    },
  ]);

  const [isSuccess, setIsSuccess] = useState(false);

  if (!supplier) return null;

  const handleAddMockFile = () => {
    setAttachments(prev => [
      ...prev,
      {
        name: `CAD_Model_Component_${prev.length + 1}.step`,
        sizeKb: 3200,
        type: 'STEP 3D',
      },
    ]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleCertToggle = (code: string) => {
    setSelectedCerts(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await onSubmit({
        buyerId: 'buyer-demo',
        buyerName: 'Vikram Mehta',
        buyerCompany: 'Zenith Aero Robotics',
        buyerEmail: 'v.mehta@zenithaero.com',

        supplierId: supplier.id,
        supplierName: supplier.name,

        title,
        category: supplier.category,
        material,

        quantity: Number(quantity),

        targetUnitBudget:
          targetUnitBudget !== undefined
            ? Number(targetUnitBudget)
            : undefined,

        targetDeliveryDays:
          Number(targetDeliveryDays),

        specifications,

        certificationsRequired:
          selectedCerts,

        attachments,
      });

      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch (error) {
      console.error(
        'Failed to submit RFQ:',
        error
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl border border-navy-200 overflow-hidden">
        {/* Header */}
        <div className="bg-navy-900 text-white p-5 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Request for Quotation (RFQ)
              </h2>
              <p className="text-xs text-navy-300">
                To: <strong className="text-white">{supplier.name}</strong> ({supplier.location.city})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-navy-950">
              RFQ Dispatched Successfully!
            </h3>
            <p className="text-xs text-navy-600 max-w-sm mx-auto">
              Your quote request has been sent to{' '}
              <strong>{supplier.name}</strong>. You can track status updates in your Buyer Dashboard.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]"
          >
            {/* Part Name / Title */}
            <div>
              <label className="block text-navy-800 font-bold mb-1">
                Project / Part Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5-Axis CNC Milled Titanium Drone Rotor Arm"
                className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-900 focus:bg-white focus:ring-2 focus:ring-brand-500 text-xs font-medium"
              />
            </div>

            {/* Material & Quantity Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-navy-800 font-bold mb-1">
                  Required Material <span className="text-red-500">*</span>
                </label>

                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-900 focus:bg-white focus:ring-2 focus:ring-brand-500 text-xs"
                >
                  {supplier.materials.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}

                  {POPULAR_MATERIALS.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-navy-800 font-bold mb-1">
                  Batch Quantity (Units) <span className="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  min={1}
                  required
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Number(e.target.value))
                  }
                  className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-900 focus:bg-white focus:ring-2 focus:ring-brand-500 text-xs font-medium"
                />
              </div>
            </div>

            {/* Target Delivery & Target Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-navy-800 font-bold mb-1">
                  Target Delivery Lead Time (Days)
                </label>

                <input
                  type="number"
                  min={1}
                  value={targetDeliveryDays}
                  onChange={(e) =>
                    setTargetDeliveryDays(
                      Number(e.target.value)
                    )
                  }
                  className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-900 focus:bg-white focus:ring-2 focus:ring-brand-500 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-navy-800 font-bold mb-1">
                  Target Unit Budget (USD, optional)
                </label>

                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={targetUnitBudget || ''}
                  onChange={(e) =>
                    setTargetUnitBudget(
                      e.target.value
                        ? Number(e.target.value)
                        : undefined
                    )
                  }
                  className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-900 focus:bg-white focus:ring-2 focus:ring-brand-500 text-xs font-medium"
                />
              </div>
            </div>

            {/* Technical Specifications & Tolerances */}
            <div>
              <label className="block text-navy-800 font-bold mb-1">
                Technical Specifications & Surface Finish Requirements
              </label>

              <textarea
                rows={3}
                value={specifications}
                onChange={(e) =>
                  setSpecifications(e.target.value)
                }
                placeholder="Include key tolerances (e.g. ±0.01 mm), surface finish (e.g. Ra 0.8 µm), heat treatment, and inspection criteria..."
                className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-900 focus:bg-white focus:ring-2 focus:ring-brand-500 text-xs font-medium"
              />
            </div>

            {/* Mandatory Certifications for this RFQ */}
            <div>
              <label className="block text-navy-800 font-bold mb-1.5">
                Required Quality Certifications
              </label>

              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS_LIST.slice(0, 4).map(cert => (
                  <button
                    type="button"
                    key={cert.code}
                    onClick={() =>
                      handleCertToggle(cert.code)
                    }
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${selectedCerts.includes(cert.code)
                      ? 'bg-brand-50 text-brand-700 border-brand-300'
                      : 'bg-white text-navy-600 border-navy-200 hover:bg-navy-50'
                      }`}
                  >
                    {cert.code}
                  </button>
                ))}
              </div>
            </div>

            {/* CAD & Drawing File Attachments */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-navy-800 font-bold">
                  CAD / 2D Drawing Attachments
                </label>

                <button
                  type="button"
                  onClick={handleAddMockFile}
                  className="text-brand-600 hover:text-brand-800 font-semibold flex items-center space-x-1"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>+ Attach File (.STEP, .PDF, .DXF)</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-navy-50 rounded-lg border border-navy-200"
                  >
                    <div className="flex items-center space-x-2">
                      <FileCode2 className="w-4 h-4 text-brand-600" />
                      <span className="font-medium text-navy-900">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-navy-400">
                        ({(file.sizeKb / 1024).toFixed(1)} MB)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveFile(idx)
                      }
                      className="text-navy-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-4 border-t border-navy-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-navy-600 hover:text-navy-900"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg shadow-md hover:shadow transition flex items-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit RFQ to Supplier</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}