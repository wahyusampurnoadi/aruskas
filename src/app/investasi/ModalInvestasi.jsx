// components/ModalInvestasi.js
import { FaTimes } from 'react-icons/fa';

export default function ModalInvestasi({ isOpen, onClose, onSave, activeTab, formData, setFormData }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-bold">Tambah {activeTab}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <FaTimes />
          </button>
        </div>
        
        {/* Form Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">Nama Instrumen</label>
            <input 
              required
              type="text" 
              placeholder="Contoh: BBCA / Logam Mulia"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-white"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">Harga Beli</label>
              <input 
                required
                type="number" 
                placeholder="Rp"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">Nilai Saat Ini</label>
              <input 
                required
                type="number" 
                placeholder="Rp"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white"
                value={formData.currentVal}
                onChange={(e) => setFormData({...formData, currentVal: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/5 transition text-gray-300"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-900/20 text-white"
            >
              Simpan Aset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}