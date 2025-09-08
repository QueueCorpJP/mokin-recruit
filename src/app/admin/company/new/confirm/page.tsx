import React from 'react';
import CompanyConfirmClient from './CompanyConfirmClient';
import { CompanyFormData } from '../actions';

// デフォルトの空データ（セッションストレージにデータがない場合のフォールバック）
const defaultCompanyData: CompanyFormData = {
  companyId: '',
  plan: '',
  companyName: '',
  urls: [{ title: '', url: '' }],
  iconImage: null,
  representativePosition: '',
  representativeName: '',
  establishedYear: '',
  capital: '',
  capitalUnit: '万円',
  employeeCount: '',
  industries: [],
  businessContent: '',
  prefecture: '',
  address: '',
  companyPhase: '',
  images: [],
  attractions: [
    { title: '', description: '' },
    { title: '', description: '' }
  ],
};

export default function CompanyNewConfirmPage() {
  return <CompanyConfirmClient companyData={defaultCompanyData} />;
}