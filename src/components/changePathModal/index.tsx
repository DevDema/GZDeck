import { ReactElement, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { Card , Form } from 'react-bootstrap';
import { changePathModalProps } from './types';

export const ChangePathModal = (props: changePathModalProps): ReactElement => {
  const {
    showModal,
    setShowModal,
  } = props;
  const { t } = useTranslation('common', { useSuspense: false });
  const [iwadsPathValue, setIwadsPathValue] = useState('');
  const [pwadsPathValue, setPwadsPathValue] = useState('');

  const handleIWADChange = (event) => {
    setIwadsPathValue(event.target.value);
  };

  const handlePWADChange = (event) => {
    setPwadsPathValue(event.target.value);
  };

  const openFolderDialog = (setInputValue) => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(result => {
      if (!result.canceled) {
        setInputValue(result.filePaths[0]);
      }
    }).catch(err => {
      console.error('Failed to open dialog:', err);
    });
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>{t('PATH_CONFIGURATION')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Form.Group controlId="formPathInput">
                <Form.Label>{t('IWADS_PATH')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={iwadsPathValue}
                    onChange={handleIWADChange}
                    placeholder={t('IWADS_PATH_PLACEHOLDER')}
                  />
                <Form.Label>{t('PWADS_PATH')}</Form.Label>
                <Form.Control
                  type="text"
                  value={pwadsPathValue}
                  onChange={handlePWADChange}
                  placeholder={t('PWADS_PATH_PLACEHOLDER')}
                />
          </Form.Group>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button
          data-inputcategory="modal"
          className="custom-button"
          variant="primary"
          onClick={() => setShowModal(false)}
        >
          {t('OK')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePathModal;
