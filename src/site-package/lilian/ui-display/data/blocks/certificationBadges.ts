import type { CertificationBadgesContent } from "../../types";

const certificationBadges: CertificationBadgesContent = {
  eyebrow: { zh: "认证", en: "Certifications" },
  certifications: [
    { name: "BSCI", fullName: { zh: "商业社会责任倡议", en: "Business Social Compliance Initiative" }, description: { zh: "供应链中的道德制造标准。", en: "Ethical manufacturing standards across our supply chain." } },
    { name: "OEKO-TEX", fullName: { zh: "STANDARD 100", en: "STANDARD 100" }, description: { zh: "面料经过有害物质测试，适合皮肤接触。", en: "All fabrics tested for harmful substances, safe for skin contact." } },
    { name: "GOTS", fullName: { zh: "全球有机纺织品标准", en: "Global Organic Textile Standard" }, description: { zh: "有机纤维认证与环境标准。", en: "Organic fiber certification with environmental criteria." } },
    { name: "FSC", fullName: { zh: "森林管理委员会", en: "Forest Stewardship Council" }, description: { zh: "纸张和包装材料负责任采购。", en: "Responsible sourcing of all paper and packaging materials." } },
    { name: "ISO 9001", fullName: { zh: "质量管理", en: "Quality Management" }, description: { zh: "所有设施均具备质量管理体系。", en: "Certified quality management system in all facilities." } },
  ],
};

export default certificationBadges;
