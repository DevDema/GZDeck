import { ReactElement, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { Button, Card, Container } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import { useTranslation } from 'react-i18next';
import IwadModal from '../IwadModal';
import ChangePathModal from '../changePathModal';
import Spinner from 'react-bootstrap/Spinner';
import { useAppState } from '../../Providers/AppState/AppState';
import { ModFile } from '../../types';

export const LaunchBar = (props: {
  iwads: string[];
  selectedIwad: string;
  setSelectedIwad: (i: string) => void;
  selectedMods: ModFile[];
  getFocusableElements: (b: boolean, elem: string) => void;
}): ReactElement => {
  const [launchDisabled, setLaunchDisabled] = useState<boolean>(false);
  const [showIwadModal, setShowIwadModal] = useState<boolean>(false);
  const [showChangePathsModal, setShowChangePathsModal] = useState<boolean>(false);
  const {
    iwads,
    setSelectedIwad,
    selectedMods,
    selectedIwad,
    getFocusableElements,
  } = props;
  const { setAppState, appState } = useAppState();
  const { t } = useTranslation('common', { useSuspense: false });

  const startEngine = async () => {
    setLaunchDisabled(true);
    await setAppState({
      setAppState: setAppState,
      appState: { inputDisabled: true },
    });
    try {
      await window.Main.startEngine(
        selectedMods.map(f => `${f.path}`),
        selectedIwad
      );
      await window.Main.writeSettings({
        previousRun: {
          iwad: selectedIwad,
          mods: selectedMods,
        },
        savedConfigs: [],
      });
    } catch (e) {
      alert(e);
    }
    setLaunchDisabled(false);
    await setAppState({
      setAppState: setAppState,
      appState: { inputDisabled: false },
    });
  };

  useEffect(() => {
    if (!appState.inputDisabled) {
      getFocusableElements(showIwadModal, 'iwad');
    }
  }, [showIwadModal]);

  return (
    <Container style={{ position: 'fixed', bottom: '20px' }}>
      <IwadModal
        showModal={showIwadModal}
        setShowModal={setShowIwadModal}
        setValue={setSelectedIwad}
        iwads={iwads}
        selectedIwad={selectedIwad}
      />
      <ChangePathModal
        showModal={showChangePathsModal}
        setShowModal={setShowChangePathsModal}
      />
      <Row style={{ height: '10rem' }}>
        <Col>
          <Card style={{ height: '80%' }} className="transparent-item">
            <Card.Header>
              {t('SELECTED_IWAD')}: {selectedIwad || t('NONE')}
            </Card.Header>
            <Card.Body>
              <Row>
              <Button
                  data-inputcategory="left"
                  className="custom-button"
                  style={{ width: '50%', height: '100%' }}
                  onClick={() => setShowChangePathsModal(true)}
                >
                  {t('CHANGE_PATHS')}
                </Button>
                <Button
                  data-inputcategory="left"
                  className="custom-button"
                  style={{ width: '50%', height: '100%' }}
                  onClick={() => setShowIwadModal(true)}
                >
                  {t('SET_IWAD')}
                </Button>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Button
            data-inputcategory="launch"
            className="launch-button"
            disabled={launchDisabled || !selectedIwad}
            style={{
              width: '90%',
              height: '80%',
              fontSize: '48px',
              backgroundColor: 'black',
              color: 'white !important',
            }}
            onClick={() => startEngine()}
          >
            {launchDisabled ? (
              <Spinner animation="border" variant="danger" />
            ) : (
              t('LAUNCH')
            )}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LaunchBar;
