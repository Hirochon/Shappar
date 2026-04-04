import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorDisplay } from '@/components/error-display';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCreatePoll } from '@/hooks/useCreatePoll';
import { ApiError } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import type { CreatePostOptionRequest } from '@/types/api';

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

type OptionField = {
  id: number;
  answer: string;
};

type FormErrors = {
  question: string | null;
  options: string[];
};

function createOption(id: number): OptionField {
  return { id, answer: '' };
}

function createInitialOptions() {
  return Array.from({ length: MIN_OPTIONS }, (_, index) => createOption(index + 1));
}

function createEmptyErrors(optionCount: number): FormErrors {
  return {
    question: null,
    options: Array.from({ length: optionCount }, () => ''),
  };
}

function getNormalizedOption(answer: string) {
  return answer.trim();
}

function validateForm(question: string, options: OptionField[]) {
  const questionError = question.trim().length === 0 ? '質問を入力してください。' : null;
  const optionErrors: string[] = options.map((option) =>
    getNormalizedOption(option.answer).length === 0
      ? '選択肢を入力してください。'
      : '',
  );
  const normalizedOptions = options.map((option) =>
    getNormalizedOption(option.answer),
  );
  const duplicateIndexes = new Map<string, number[]>();

  normalizedOptions.forEach((answer, index) => {
    if (answer.length === 0) {
      return;
    }

    const key = answer.toLowerCase();
    const indexes = duplicateIndexes.get(key) ?? [];
    indexes.push(index);
    duplicateIndexes.set(key, indexes);
  });

  duplicateIndexes.forEach((indexes) => {
    if (indexes.length < 2) {
      return;
    }

    indexes.forEach((index) => {
      optionErrors[index] = '同じ選択肢は設定できません。';
    });
  });

  return {
    questionError,
    optionErrors,
    hasErrors:
      questionError !== null || optionErrors.some((error) => error.length > 0),
  };
}

function getSubmitErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 400) {
    return '入力内容を確認してください。';
  }

  return '投票の作成に失敗しました。時間をおいて再度お試しください。';
}

export function CreatePollPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<OptionField[]>(createInitialOptions);
  const [nextOptionId, setNextOptionId] = useState(MIN_OPTIONS + 1);
  const [errors, setErrors] = useState<FormErrors>(() =>
    createEmptyErrors(MIN_OPTIONS),
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutateAsync: createPoll, isPending } = useCreatePoll();

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    setSubmitError(null);
    setErrors((current) => ({ ...current, question: null }));
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    setOptions((current) =>
      current.map((option, index) =>
        index === optionIndex ? { ...option, answer: value } : option,
      ),
    );
    setSubmitError(null);
    setErrors((current) => ({
      ...current,
      options: current.options.map((error, index) =>
        index === optionIndex ? '' : error,
      ),
    }));
  };

  const handleAddOption = () => {
    if (options.length >= MAX_OPTIONS) {
      return;
    }

    setOptions((current) => [...current, createOption(nextOptionId)]);
    setNextOptionId((current) => current + 1);
    setErrors(createEmptyErrors(options.length + 1));
    setSubmitError(null);
  };

  const handleRemoveOption = (optionIndex: number) => {
    if (options.length <= MIN_OPTIONS) {
      return;
    }

    setOptions((current) => current.filter((_, index) => index !== optionIndex));
    setErrors(createEmptyErrors(options.length - 1));
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const validationResult = validateForm(question, options);

    setErrors({
      question: validationResult.questionError,
      options: validationResult.optionErrors,
    });

    if (validationResult.hasErrors) {
      return;
    }

    const trimmedQuestion = question.trim();
    const normalizedOptions: CreatePostOptionRequest[] = options.map((option) => ({
      answer: getNormalizedOption(option.answer),
    }));

    try {
      const response = await createPoll({
        question: trimmedQuestion,
        options: normalizedOptions,
      });

      if (!response.post_id) {
        throw new Error('Created poll response did not include post_id');
      }

      await navigate(`/polls/${response.post_id}`);
    } catch (error) {
      setSubmitError(getSubmitErrorMessage(error));
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl">
      <Card className="border-white/70 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <CardHeader className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Create
            </p>
            <CardTitle className="text-3xl text-slate-950">
              投票を作成
            </CardTitle>
          </div>
          <CardDescription className="text-base leading-7 text-slate-600">
            質問文と選択肢を入力して、新しい投票を公開します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-8"
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
          >
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-900"
                htmlFor="question"
              >
                質問
              </label>
              <textarea
                aria-describedby={errors.question ? 'question-error' : undefined}
                aria-invalid={errors.question ? 'true' : 'false'}
                className={cn(
                  'flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  errors.question
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : undefined,
                )}
                disabled={isPending}
                id="question"
                onChange={(event) => {
                  handleQuestionChange(event.target.value);
                }}
                placeholder="みんなに聞いてみたいことを書きましょう"
                value={question}
              />
              {errors.question ? (
                <p
                  className="text-sm font-medium text-red-600"
                  id="question-error"
                >
                  {errors.question}
                </p>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-medium text-slate-900">選択肢</h2>
                  <p className="text-sm text-slate-500">
                    2〜6 個まで追加できます。
                  </p>
                </div>
                <Button
                  disabled={isPending || options.length >= MAX_OPTIONS}
                  onClick={handleAddOption}
                  type="button"
                  variant="outline"
                >
                  選択肢を追加
                </Button>
              </div>
              <div className="space-y-4">
                {options.map((option, index) => {
                  const error = errors.options[index];
                  const inputId = `option-${option.id}`;
                  const errorId = `${inputId}-error`;

                  return (
                    <div className="space-y-2" key={option.id}>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 space-y-2">
                          <label
                            className="text-sm font-medium text-slate-900"
                            htmlFor={inputId}
                          >
                            選択肢 {index + 1}
                          </label>
                          <Input
                            aria-describedby={error ? errorId : undefined}
                            aria-invalid={error ? 'true' : 'false'}
                            className={
                              error
                                ? 'border-red-500 focus-visible:ring-red-500'
                                : undefined
                            }
                            disabled={isPending}
                            id={inputId}
                            onChange={(event) => {
                              handleOptionChange(index, event.target.value);
                            }}
                            placeholder={`選択肢 ${index + 1} を入力`}
                            value={option.answer}
                          />
                        </div>
                        {options.length > MIN_OPTIONS ? (
                          <Button
                            aria-label={`選択肢 ${index + 1} を削除`}
                            className="mt-7"
                            disabled={isPending}
                            onClick={() => {
                              handleRemoveOption(index);
                            }}
                            type="button"
                            variant="ghost"
                          >
                            削除
                          </Button>
                        ) : null}
                      </div>
                      {error ? (
                        <p
                          className="text-sm font-medium text-red-600"
                          id={errorId}
                        >
                          {error}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {submitError ? <ErrorDisplay message={submitError} /> : null}

            <Button
              className="h-11 w-full rounded-xl text-base font-semibold"
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="size-4 animate-spin"
                    data-testid="create-poll-spinner"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-90"
                      d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>投票を作成中...</span>
                </>
              ) : (
                '投票を作成'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
