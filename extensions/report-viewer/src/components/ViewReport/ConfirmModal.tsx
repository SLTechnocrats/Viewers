import React, { Fragment, useRef } from 'react';
import './TableView.css';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition } from '@headlessui/react';

interface OwnProps {
  show: boolean;
  onClose: () => void;
  onPressConfirm: () => void;
}

type Props = OwnProps;

const ActionsModal: React.FC<Props> = ({ show, onPressConfirm, onClose }) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition
      show={show}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-10 max-w-2xl"
        initialFocus={cancelButtonRef}
        onClose={() => onClose()}
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              style={{ width: '30rem' }}
              className="relative flex w-[calc(100%-62px)] transform flex-col rounded bg-white text-left shadow-xl transition-all sm:my-8"
            >
              <div className="h-[10%] rounded-t border-b-2 bg-white p-1 px-4 sm:p-4 sm:pb-2">
                <div className="sm:flex sm:items-start">
                  <div className="w-full text-center sm:mt-0 sm:text-left">
                    <div className="flex w-full justify-between">
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Are You Sure ?
                      </DialogTitle>
                      <div
                        onClick={() => onClose()}
                        className="w-6 text-blue-500"
                      >
                        <CloseIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[80%] w-full p-2">
                <p className="mt-1 text-sm text-gray-500">
                  It will create a new report where you can select different modality for same
                  parent report. It will help in multiple reporting.
                </p>
              </div>
              <div className="flex h-[10%] w-full items-center justify-end gap-x-2 border-t border-[#CED4DA] p-1">
                <button
                  onClick={() => onPressConfirm()}
                  className="flex w-full items-center justify-center border border-transparent bg-green-600 p-4 text-sm font-medium text-white hover:text-black"
                >
                  Accept
                </button>
                <button
                  onClick={() => onClose()}
                  className="flex w-full items-center justify-center border border-transparent bg-red-600 p-4 text-sm font-medium text-white hover:text-black"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ActionsModal;

const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
};
