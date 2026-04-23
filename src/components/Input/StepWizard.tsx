import { AnimatePresence, motion } from 'framer-motion'
import { usePatientStore } from '../../store/patientStore'
import ProgressStepper from '../Layout/ProgressStepper'
import Step1_BasicInfo from './Step1_BasicInfo'
import Step2_MedHistory from './Step2_MedHistory'
import Step3_Medications from './Step3_Medications'
import Step4_LabValues from './Step4_LabValues'
import Step5_Symptoms from './Step5_Symptoms'
import Step6_Clinical from './Step6_Clinical'

const STEPS = [Step1_BasicInfo, Step2_MedHistory, Step3_Medications, Step4_LabValues, Step5_Symptoms, Step6_Clinical]

export default function StepWizard() {
  const { currentStep } = usePatientStore()
  const StepComponent = STEPS[currentStep - 1]

  return (
    <div className="min-h-screen py-8 px-4 bg-grid" style={{ background: 'linear-gradient(180deg,#FFF5F3 0%,#FFF0EE 100%)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <ProgressStepper currentStep={currentStep} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
