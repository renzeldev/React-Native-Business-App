export function gotPersonalInfo(personalInfo) {
  return {
    type: 'GOT_PERSONAL_INFO',
    data: {personalInfo}
  }
}