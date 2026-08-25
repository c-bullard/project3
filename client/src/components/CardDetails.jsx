import { forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CardDetails({
  card,
  open,
  onClose,
  actionLabel = 'Add to collection',
}) {
  if (!card) {
    return null;
  }

  return (
    <Dialog
      open={open}
      slots={{
        transition: Transition,
      }}
      keepMounted
      onClose={onClose}
    >
      <DialogTitle>{card.name}</DialogTitle>
      <DialogContent>
        <div className="card-details">
          <div className="card-details-info">
            {card.mana_cost && (
              <div className="card-details-row">
                <span className="card-details-label">Mana Cost</span>
                <span>{card.mana_cost}</span>
              </div>
            )}
            {card.type_line && (
              <div className="card-details-row">
                <span className="card-details-label">Type</span>
                <span>{card.type_line}</span>
              </div>
            )}
            {card.oracle_text && (
              <div className="card-details-row">
                <span className="card-details-label">Text</span>
                <span>{card.oracle_text}</span>
              </div>
            )}
            {card.set_name && (
              <div className="card-details-row">
                <span className="card-details-label">Set</span>
                <span>
                  {card.set_name}
                  {card.set_code ? `(${card.set_code.toUpperCase()})` : ''}
                </span>
              </div>
            )}
            {card.usd != null && (
              <div className="card-details-row">
                <span className="card-details-label">Price</span>
                <span>${card.usd}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{actionLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
