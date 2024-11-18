// import { Request, Response } from 'express';
// import { confirmWillActivity} from '../Services/willService';

// export const confirmActivity = async (req: Request, res: Response): Promise<void> => {
//   const { userId } = req.params;

//   try {
//     await confirmWillActivity(req,res);
//     res.status(200).json({ message: 'Confirmation received. Your will has been updated.' });
//   } catch (error) {
//     console.error('Error confirming activity:', error);
//     res.status(500).json({ message: 'An error occurred while confirming your activity.' });
//   }
// };
import { Request, Response } from 'express';
import { confirmWillActivity} from '../Services/willService';

export const confirmActivity = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
  
    try {
        await confirmWillActivity(req,res);
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
      res.status(500).json({ message: 'Failed to send email' });
    }
  };
  