import React from 'react';
import { Radio, Shield, Heart, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      {/* Top Banner */}
      <div className="bg-navy-900 border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-moes-600 flex items-center justify-center">
                <Radio className="w-4 h-4 text-white" />
              </div>
              <span>CAPACITY CONNECT</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Centralized Digital Capacity Building and Learning Management Portal for the Ministry of Earth Sciences (MoES), India Meteorological Department (IMD), INCOIS, NCMRWF, IITM, and NIOT.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Compliant with WMO-No. 1083 & CBC Standards</span>
            </div>
          </div>

          {/* Col 2: MoES Institutes */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Participating Institutions</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="https://mausam.imd.gov.in" target="_blank" rel="noreferrer" className="hover:text-sky-400 flex items-center gap-1">India Meteorological Department (IMD) <ExternalLink className="w-2.5 h-2.5 opacity-50"/></a></li>
              <li><a href="https://incois.gov.in" target="_blank" rel="noreferrer" className="hover:text-sky-400 flex items-center gap-1">INCOIS Hyderabad <ExternalLink className="w-2.5 h-2.5 opacity-50"/></a></li>
              <li><a href="https://ncmrwf.gov.in" target="_blank" rel="noreferrer" className="hover:text-sky-400 flex items-center gap-1">NCMRWF Medium Range Weather Forecasting <ExternalLink className="w-2.5 h-2.5 opacity-50"/></a></li>
              <li><a href="https://tropmet.res.in" target="_blank" rel="noreferrer" className="hover:text-sky-400 flex items-center gap-1">IITM Pune <ExternalLink className="w-2.5 h-2.5 opacity-50"/></a></li>
              <li><a href="https://niot.res.in" target="_blank" rel="noreferrer" className="hover:text-sky-400 flex items-center gap-1">National Institute of Ocean Technology (NIOT) <ExternalLink className="w-2.5 h-2.5 opacity-50"/></a></li>
            </ul>
          </div>

          {/* Col 3: Key Specialized Domains */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Core Training Domains</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>• Doppler Weather Radar (DWR) Polarimetry</li>
              <li>• Numerical Weather Prediction & 4D-Var</li>
              <li>• Satellite Remote Sensing (INSAT-3D/3DR)</li>
              <li>• Coastal Ocean State & Tsunami Warnings</li>
              <li>• Severe Thunderstorm Nowcasting & Aviation</li>
              <li>• Seismology & Real-time Phase Inversion</li>
            </ul>
          </div>

          {/* Col 4: Contact & Helpdesk */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Training Cell Helpdesk</h4>
            <div className="flex items-start gap-2 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-moes-400 shrink-0 mt-0.5" />
              <span>Capacity Building Cell, Prithvi Bhavan, Lodhi Road, New Delhi - 110003</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-moes-400 shrink-0" />
              <span>capacity.connect@moes.gov.in</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-moes-400 shrink-0" />
              <span>+91-11-24669500 / Toll Free: 1800-180-1717</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal / SIH Notice */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
        <p>
          © 2026 Ministry of Earth Sciences (MoES), Government of India. All Rights Reserved.
        </p>
        <p className="flex items-center gap-1 text-slate-400">
          Smart India Hackathon 2026 • Problem Statement ID: <span className="text-amber-400 font-mono font-bold">26075</span>
        </p>
      </div>
    </footer>
  );
};
