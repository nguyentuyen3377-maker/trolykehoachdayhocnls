
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ScheduleRow } from './types';
import { geminiService } from './services/geminiService';
import { SUBJECTS, GRADES, ATTAINMENT_LEVELS, REGULATION_TAGS } from './constants';

const App: React.FC = () => {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [grade, setGrade] = useState(GRADES[2]); // Lớp 3
  const [level, setLevel] = useState(ATTAINMENT_LEVELS[0]);
  const [planRows, setPlanRows] = useState<ScheduleRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await geminiService.generateFullPlan(subject, grade, level);
      if (Array.isArray(result)) {
        setPlanRows(result.map((r: any) => ({ 
          ...r, 
          id: Math.random().toString(36).substr(2, 9), 
          note: r.note || "" 
        })));
      } else {
        throw new Error("Định dạng dữ liệu không hợp lệ.");
      }
    } catch (error: any) {
      alert(`Không thể thiết lập kế hoạch: ${error.message}\n\nVui lòng kiểm tra lại API Key hoặc thử lại sau giây lát.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-wrap items-center justify-end gap-2 mb-8">
        {REGULATION_TAGS.map(tag => (
          <span key={tag.id} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded uppercase border border-slate-200">
            {tag.label}
          </span>
        ))}
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-900 uppercase tracking-tight">
          Kế hoạch dạy học môn {subject}
        </h1>
        <div className="flex items-center text-emerald-600 font-semibold mt-2">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Khung năng lực số tích hợp - CV 3456/BGDĐT-GDPT
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Môn học</label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition outline-none"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Khối lớp (Tối ưu AI)</label>
            <select 
              value={grade} 
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition outline-none"
            >
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Mức độ đạt được</label>
            <select 
              value={level} 
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition outline-none"
            >
              {ATTAINMENT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className={`rounded-xl py-3.5 font-bold transition shadow-lg flex items-center justify-center space-x-2 w-full ${
              isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang thiết lập 35 tuần...
              </span>
            ) : (
              <>
                <span className="text-xl">✨</span>
                <span>Thiết lập bằng AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-700 uppercase flex items-center">
            <span className="w-1 h-6 bg-indigo-500 mr-3 rounded-full"></span>
            Chi tiết Kế hoạch {subject} - {grade}
          </h2>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-200 transition">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Tải Excel
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 transition">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              In PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 border-r border-slate-200 w-24">Tuần</th>
                <th className="px-6 py-4 border-r border-slate-200 min-w-[180px]">Chủ đề</th>
                <th className="px-6 py-4 border-r border-slate-200 min-w-[220px]">Tên bài học</th>
                <th className="px-6 py-4 border-r border-slate-200 w-20 text-center">Tiết</th>
                <th className="px-6 py-4 border-r border-slate-200 min-w-[140px]">Mã NLS</th>
                <th className="px-6 py-4 border-r border-slate-200 min-w-[280px]">Nội dung tích hợp</th>
                <th className="px-6 py-4 w-32">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {planRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400 italic">
                    Nhấn "Thiết lập bằng AI" để tự động tạo kế hoạch 35 tuần theo đúng quy định.
                  </td>
                </tr>
              ) : (
                planRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="px-6 py-4 border-r border-slate-100 font-bold text-slate-700">{row.weekMonth}</td>
                    <td className="px-6 py-4 border-r border-slate-100 text-slate-600 font-medium">{row.theme}</td>
                    <td className="px-6 py-4 border-r border-slate-100 text-slate-900 font-bold">{row.lessonName}</td>
                    <td className="px-6 py-4 border-r border-slate-100 text-center font-bold text-indigo-600">{row.periods}</td>
                    <td className="px-6 py-4 border-r border-slate-100">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold border border-indigo-100">
                        {row.digitalCompetencyCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-slate-100 text-slate-600 text-xs leading-relaxed italic">
                      {row.integrationSuggestions}
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        className="w-full bg-transparent border-none text-xs focus:ring-0 placeholder-slate-300" 
                        placeholder="..."
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default App;
