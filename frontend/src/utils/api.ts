const API_BASE_URL = typeof window !== 'undefined' 
  ? (window.location.port === '3000' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8000/api' : '/api')
  : 'http://localhost:8000/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = new Headers(options.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Set JSON content-type if body is provided and is not FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Something went wrong');
  }

  return response.json();
}

export const api = {
  // Authentication
  login: async (payload: any) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  },

  signup: async (payload: any) => {
    const data = await fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  },

  getMe: () => fetchAPI('/auth/me'),

  // Profiles
  getProfile: () => fetchAPI('/students/profile'),
  updateProfile: (payload: any) => fetchAPI('/students/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),

  // Resume Analyzer
  analyzeResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchAPI('/students/resume/analyze', {
      method: 'POST',
      body: formData,
    });
  },
  getResumeReport: () => fetchAPI('/students/resume/report'),

  // Skill Gap
  getSkillGap: () => fetchAPI('/students/skill-gap'),

  // Jobs & Placements
  getJobs: (params?: { is_internship?: boolean; is_placement?: boolean; search?: string }) => {
    let query = '';
    if (params) {
      const parts = [];
      if (params.is_internship !== undefined) parts.push(`is_internship=${params.is_internship}`);
      if (params.is_placement !== undefined) parts.push(`is_placement=${params.is_placement}`);
      if (params.search) parts.push(`search=${encodeURIComponent(params.search)}`);
      if (parts.length) query = `?${parts.join('&')}`;
    }
    return fetchAPI(`/jobs/${query}`);
  },
  getJobRecommendations: () => fetchAPI('/jobs/recommendations'),
  applyJob: (jobId: number) => fetchAPI(`/jobs/${jobId}/apply`, { method: 'POST' }),
  getStudentApplications: () => fetchAPI('/jobs/applications'),
  getRecruiterApplicants: () => fetchAPI('/jobs/recruiter/applicants'),
  updateApplicationStatus: (appId: number, status: string, feedback?: string) => fetchAPI(`/jobs/applications/${appId}`, {
    method: 'PUT',
    body: JSON.stringify({ status, feedback }),
  }),

  // Assessments
  getQuestions: (type: string) => fetchAPI(`/assessments/questions?type=${type}`),
  submitAssessment: (type: string, answers: any) => fetchAPI(`/assessments/submit?type=${type}`, {
    method: 'POST',
    body: JSON.stringify(answers),
  }),
  getAssessmentHistory: () => fetchAPI('/assessments/history'),

  // Mock Interviews
  getInterviewQuestions: (type: string) => fetchAPI(`/interviews/questions?type=${type}`),
  submitInterview: (questions: string[], answers: string[], type: string) => fetchAPI(`/interviews/submit?type=${type}`, {
    method: 'POST',
    body: JSON.stringify({
      questions: JSON.stringify(questions),
      answers: JSON.stringify(answers),
    }),
  }),
  getInterviewHistory: () => fetchAPI('/interviews/history'),

  // Chatbot Mentor
  sendMessage: (message: string, history: any[]) => fetchAPI('/chats/message', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  }),

  // Analytics
  getAnalytics: () => fetchAPI('/analytics/dashboard'),

  // Notifications
  getNotifications: () => fetchAPI('/notifications'),
  markNotificationRead: (notifId: number) => fetchAPI(`/notifications/${notifId}/read`, { method: 'PUT' }),
};
