import './index.css';
import { createAdminApp } from '@/core/app/createAdminApp';
import { projectPackage } from '@/package';

createAdminApp(projectPackage).mount();
