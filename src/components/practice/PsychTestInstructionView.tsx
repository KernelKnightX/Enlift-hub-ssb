import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getPsychModule, type PsychTestModuleId } from '@/data/psychTestModules';

type Props = { moduleId: PsychTestModuleId };

/** Legacy /instructions URLs fold into /sets so browser Back does not return here after a test. */
export function PsychTestInstructionView({ moduleId }: Props) {
  const navigate = useNavigate();
  const module = getPsychModule(moduleId);

  useEffect(() => {
    navigate(`${module.routes.sets}?instructions=1`, { replace: true });
  }, [moduleId, module.routes.sets, navigate]);

  return null;
}
