import React from 'react';
import { useTranslations } from 'next-intl';
import { FileText, Upload, Link as LinkIcon, Plus, File, Trash2, ExternalLink, Search } from 'lucide-react';
import { toast } from 'sonner';

export const KnowledgeTab = () => {
  const t = useTranslations("Dashboard.Agents.Detail");

  const handleAddSource = () => {
    toast.info(t("knowledge.add") + " - Coming Soon");
  };

  const documents = [
    { id: 1, name: 'Product Manual v2.pdf', type: 'PDF', size: '2.4 MB', date: 'Oct 24, 2023', status: 'Indexed' },
    { id: 2, name: 'Pricing Guide 2024', type: 'Web', size: '156 KB', date: 'Nov 02, 2023', status: 'Indexed' },
    { id: 3, name: 'Support FAQs', type: 'Text', size: '45 KB', date: 'Nov 10, 2023', status: 'Processing' },
    { id: 4, name: 'API Documentation', type: 'Web', size: '1.2 MB', date: 'Nov 15, 2023', status: 'Indexed' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">{t('knowledge.title')}</h3>
          <p className="text-sm text-slate-600">{t('knowledge.subtitle')}</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('knowledge.searchPlaceholder')} 
              className="pl-9 pr-4 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#005bbc] focus:ring-0 w-64"
            />
          </div>
          <button 
            onClick={handleAddSource}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#005bbc] hover:bg-[#004a9f] border border-[#005bbc] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("knowledge.add")}
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('knowledge.table.name')}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('knowledge.table.type')}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('knowledge.table.dateAdded')}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('knowledge.table.status')}</th>
                <th className="text-right py-4 px-6 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('knowledge.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border-2 border-slate-200">
                        {doc.type === 'PDF' && <FileText className="w-5 h-5" />}
                        {doc.type === 'Web' && <LinkIcon className="w-5 h-5" />}
                        {doc.type === 'Text' && <File className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{doc.name}</div>
                        <div className="text-xs text-slate-500">{doc.size}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {doc.date}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border-2 ${
                      doc.status === 'Indexed' 
                        ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' 
                        : 'bg-[#ffd600]/10 text-[#ffd600] border-[#ffd600]/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        doc.status === 'Indexed' ? 'bg-[#10B981]' : 'bg-[#ffd600]'
                      }`} />
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-[#005bbc] hover:bg-[#005bbc]/10 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
