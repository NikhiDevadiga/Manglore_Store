import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqData = [
  {
    question: "What is Mangalore Store?",
    answer:
      "Mangalore Store is an online grocery platform offering fresh fruits, vegetables, packaged foods, daily essentials, and more — all delivered across Mangalore city.",
  },
  {
    question: "How do I place an order?",
    answer:
      "You can browse products by category, add items to your cart, and proceed to checkout. Once you confirm your order, we will process and deliver it to your doorstep.",
  },
  {
    question: "Where do you deliver?",
    answer:
      "We currently deliver across most areas in Mangalore city, ensuring wide coverage for your convenience.Whether you're in the heart of the city or in surrounding neighborhoods, our delivery network is designed to reach you promptly and reliably, bringing your essentials right to your doorstep.",
  },
  {
    question: "How can I pay for my order?",
    answer:
      "We accept multiple payment methods including UPI, net banking, and Cash on Delivery (COD).",
  },
  {
    question: "When will I receive my order?",
    answer:
      "Your order will typically be delivered within a few hours, ensuring you receive your items quickly and conveniently.Our delivery team works efficiently to get your products to your doorstep as soon as possible, minimizing wait times and providing a seamless shopping experience.",
  },
  {
    question: "Can I modify or cancel my order?",
    answer:
      "No, once the order is placed, it cannot be cancelled or modified.Please make sure to review your items carefully before placing your order.",
  },
  {
    question: "What if an item is missing or damaged?",
    answer:
      "If any item is missing or damaged, please contact our support within 24 hours of delivery. We will offer a refund or replacement as applicable.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us through our website contact form, or call/WhatsApp us at the support number provided in the footer.",
  },
];

const FAQs = () => {
 return (
    <Box sx={{ backgroundColor: '#9c98ce', py: 4 }}>
      <Box p={4} maxWidth="800px" mx="auto">
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Frequently Asked Questions
        </Typography>
        {faqData.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1, background: "#e2dfdf" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default FAQs;
